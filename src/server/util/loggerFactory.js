import path from 'path'
import fs from 'fs'
import winston from 'winston'

const environment = process.env.NODE_ENV || 'dev'
const config = require(`../../../config/${environment}.json`)

const logFile = path.join(config.logger.directory, config.logger.filename)
const logLevel = config.logger.level


/** Default logger */
export const logger = winston.createLogger({
    level: config.logger.level,
    transports: [
        new winston.transports.Console({
            format: winston.format.simple()
        }),
        new winston.transports.File({
            format: winston.format.simple(),
            filename: logFile
        })
    ]
})

/**
 * Business layer for getting the data and transforming/shapping it for use upstream.
 * TODO: This is not a true singleton in Nodejs.  If we really need it to be,
 * see: https://derickbailey.com/2016/03/09/creating-a-true-singleton-in-node-js-with-es6-symbols/
 */
class LoggerFactoryInstance {

    /**
     * Customize a logger for a speciic class or namespace. (NOT IMPLEMENTED)
     * What we want:
     * - prepend the className to the beggining of the logline so we know which class is logging it
     */
    getLogger(className = 'ROOT') {
        // TODO: customizer logger and use className
        console.log(`Getting logger for: ${className} => ${logger}`)
        return logger
    }
}

const LoggerFactory = new LoggerFactoryInstance()
export default LoggerFactory