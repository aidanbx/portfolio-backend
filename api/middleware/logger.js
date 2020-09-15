const moment = require('moment-timezone');
const geoip = require('geoip-lite');
const fs = require('fs');
const ipRegex = /[\d\.]+$/;
const firstPathRegex = /^\/([a-z\.]*)\/?/;

const getIP = (req) => {
  let tmpIP = '';
  let ret = '';
  try {
    if (req.headers['x-real-ip']) {
      tmpIP = req.headers['x-real-ip'];
    } else if (req.protocol === 'http') {
      tmpIP = req.socket.remoteAddress;
    } else if (req.protocol === 'https') {
      tmpIP = req.connection.socket.remoteAddress;
    } else {
      tmpIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    }
    ret = tmpIP.match(ipRegex)[0];
  } catch (err) {
    console.error(err);
    return undefined;
  }
  return ret;
};
const makeLog = (req) => {
  let clientIP;
  let log = {};
  try {
    log.time = `${moment().tz('America/Los_Angeles')}`;
    log.method = req.method;
    log.path = req.path;
    log.domain = req.hostname;
    log.protocol = req.protocol;
    log.url = req.originalUrl;
    log.subdomains = req.subdomains;
    log.body = req.body;
  } catch (err) {
    log[err] = err;
  }
  clientIP = getIP(req);
  if (clientIP) {
    log.ip = clientIP;
    try {
      log.geo = geoip.lookup(clientIP);
    } catch (err) {
      log[err.name] = err;
    }
  } else {
    log.ip = undefined;
  }
  return log;
};

const logger = (req, res, next, logs) => {
  const basePath = req.path.match(firstPathRegex);
  let badPaths = {};
  [ 'photos', 'ceramics', 'icons' ].map((badPath) => {
    badPaths[badPath] = 0;
  });
  if (!basePath || !badPaths.hasOwnProperty(basePath[1])) {
    const log = makeLog(req, logs);

    try {
      logs[log.ip] = logs[log.ip] || {};
      logs[log.ip].time = log.time;
      logs[log.ip].geo = log.geo;
      logs[log.ip][log.path] = logs[log.ip][log.path] || [];
      logs[log.ip][log.path].push({
        time : log.time,
        body : log.body,
        loc  : `${log.method} ${req.protocol}://${req.hostname}${req.path}`,
      });
      fs.writeFile(
        './logs.json',
        JSON.stringify(logs, null, 2),
        'utf8',
        (err) => {
          if (err) {
            throw err;
          } else {
            console.log(JSON.stringify(log, null, 2));
          }
        }
      );
    } catch (error) {
      console.error(error);
      next();
    }
  }
  next();
};

module.exports = { getIP, makeLog, logger };
