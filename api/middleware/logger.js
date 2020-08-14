const moment = require('moment-timezone');
const geoip = require('geoip-lite');
const fs = require('fs');
const logFile = './logs.txt';
const ipRegex = /[\d\.]+$/;

const logger = (req, res, next) => {
  if (req.originalUrl === '/' || req.originalUrl === '/index.html') {
    try {
      const clientIP = req.headers['x-real-ip'].match(ipRegex)[0];
      const geo = geoip.lookup(clientIP);
      // console.log(clientIP);
      const log = `${moment().tz(
        'America/Los_Angeles'
      )} : ${geo.country} ${geo.region} ${geo.city} : ${req.headers[
        'x-real-ip'
      ]}`;

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

module.exports = logger;
