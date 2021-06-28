import winston from 'winston'
import path from 'path'
import fs from 'fs'

/*
 * Need to clean this up.
 * - remove LogStash
 * - setup daily rotating file
 */
export function configureLogging(config) {
	console.log('Configuring logging...')
	fs.stat(config.logger.directory, (err, stats) => {
		if (err) {
			console.log('Attempting to create log directory: ' + config.logger.directory)
			fs.mkdirSync(config.logger.directory)
		}
	})

	console.log('Log Level: ' + config.logger.level)
	winston.level = config.logger.level

	// customize console logging so it also shows unhandled errors instead of just logging in file
	winston.remove(winston.transports.Console)
	winston.add(winston.transports.Console, {
		colors: winston.config.syslog.colors,
		handleExceptions: true,
		humanReadableUnhandledException: true
	})

	const logFile = path.join(config.logger.directory, config.logger.filename)
	console.log('Log: ' + logFile)
	winston.add(winston.transports.File, {
		name: 'log-file',
		filename: path.join(config.logger.directory, config.logger.filename),
		json: false,
		maxSize: 20000000,
		maxFiles: 60,
		zippedArchive: true,
		tailable: true,
		handleExceptions: true,
		humanReadableUnhandledException: true
	})

	if (config.logger.logStashFilename) {
		const logStashLogFile = path.join(config.logger.directory, config.logger.logStashFilename)
		console.log('LogStash Log: ' + logStashLogFile)
		winston.add(winston.transports.File, {
			name: 'logstash-file',
			filename: logStashLogFile,
			maxSize: 20000000,
			maxFiles: 60,
			logstash: true,
			zippedArchive: true,
			tailable: true,
			handleExceptions: true,
			humanReadableUnhandledException: true
		})
	}
}

/*
 * If we need to, we can add a thin wrapper for winston with the 'standard' functions such as
 * trace(), debug(), info(), warn(), error(), fatal().  Log4js and Bunyan share the same interfaces.
 * For now, using Winston logger as-is should be fine even if we switch it out at some point.
 */
exports.logger = winston

export default winston
