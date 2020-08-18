const moment = require('moment-timezone');
const geoip = require('geoip-lite');
const fs = require('fs');
const ipRegex = /[\d\.]+$/;

const getLog = (ip) => {
	return logs[ip];
};

const makeLog = (req) => {
	let clientIP;
	let log = {};
	let tmpIP;
	try {
		log.time = `${moment().tz('America/Los_Angeles')}`;
		log.method = req.method;
		log.path = req.path;
		log.domain = req.hostname;
		log.protocol = req.protocol;
		log.url = req.originalUrl;
		log.subdomains = req.subdomains;
	} catch (err) {
		log[err] = err;
	}
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
		clientIP = tmpIP.match(ipRegex)[0];
	} catch (err) {
		log[err] = err.message;
		clientIP = undefined;
	}
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
	const log = makeLog(req, logs);

	try {
		logs[log.ip] = logs[log.ip] || {};
		logs[log.ip][log.path] = logs[log.ip][log.path] || [];
		logs[log.ip][log.path].push({
			time: log.time,
			loc: `${log.method} ${req.protocol}://${req.hostname}${req.path}`
		});
		fs.writeFile('./logs.json', JSON.stringify(logs, null, 2), 'utf8', (err) => {
			if (err) {
				throw err;
			} else {
				console.log(JSON.stringify(logs, null, 2));
			}
		});
	} catch (error) {
		console.error(error);
		next();
	}
	next();
};

module.exports = { getLog, makeLog, logger };
