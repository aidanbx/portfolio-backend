const moment = require('moment-timezone');
const geoip = require('geoip-lite');
const fs = require('fs');
const logFile = './logs.JSON';
const logs = require(logFile);
const ipRegex = /[\d\.]+$/;

const getLog = (ip) => {
	return logs[ip];
};

const makeLog = (req) => {
	let clientIP;
	let log = {};
	try {
		clientIP = req.headers['x-real-ip'].match(ipRegex)[0];
	} catch (err) {
		log[err.name] = err;
		clientIP = (req.headers['x-forwarded-for'] || req.connection.remoteAddress).match(ipRegex)[0];
	}
	if (clientIP) {
		log.ip = clientIP;
		try {
			log.geo = geoip.lookup(clientIP);
			log.time = moment().tz('America/Los_Angeles');
		} catch (err) {
			log[err.name] = err;
		}
	} else {
		log.ip = undefined;
	}
	log.url = req.originalUrl;
	log.domain = req.hostname;
	log.protocol = req.protocol;
	log.path = req.path;
	log.subdomains = req.subdomains;
	log.method = method;
	return log;
};

const logger = (req, res, next) => {
	const log = makeLog(req);

	try {
		logs[log.ip] = log;
		fs.writeFile(logFile, JSON.stringify(log, null, 2), 'utf8', (err) => {
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
	next();
};

module.exports = { getLog, makeLog, logger };
