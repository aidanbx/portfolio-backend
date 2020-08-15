const moment = require('moment-timezone');
const geoip = require('geoip-lite');
const fs = require('fs');
const logFile = './logs.txt';
const ipRegex = /[\d\.]+$/;

const getLog = (req) => {
  let clientIP;
  try {
    clientIP = req.headers['x-real-ip'].match(ipRegex)[0];
  } catch (err) {
    clientIP = (req.headers['x-forwarded-for'] || req.connection.remoteAddress)
      .match(ipRegex)[0];
  }
  if (clientIP) {
    try {
      console.log(clientIP);
      const geo = geoip.lookup(clientIP);
      // console.log(clientIP);
      const log = `${moment().tz(
        'America/Los_Angeles'
      )} : ${geo.country} ${geo.region} ${geo.city} : ${req.headers[
        'x-real-ip'
      ]}`;
      return log;
    } catch (err) {
      return clientIP;
    }
  }
  return "Couldn't get IP addr";
};

const logger = (req, res, next) => {
  if (req.originalUrl === '/' || req.originalUrl === '/index.html') {
    try {
      const log = getLog(req);

      fs.appendFile(logFile, log + '\n', 'utf8', (err) => {
        if (err) {
          throw err;
        } else {
          console.log(log);
        }
      });
    } catch (error) {
      console.error(error);
      next();
    }
  }
  next();
};

module.exports = { getLog, logger };
