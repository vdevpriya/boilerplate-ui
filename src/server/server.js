/*
    This is our node server.  We register the i18n and actual html plugins, set https,
    configure routes and requests here.  Since we have an app that actually routes on
    the frontend, these routes mostly just serve to either proxy external requests
    that might be made, for example, in an api call.  If it's a route that we 'navigate'
    to on the frontend, we have to register it here so that react-router can access it.
*/

'use strict';

import Hapi from 'hapi'
import path from 'path'
import Vision from 'vision'
import Mustache from 'mustache'
import Inert from 'inert'
import i18n from 'hapi-basic-i18n'
import fs from 'fs'
import epimetheus from 'epimetheus'

import routes from './routes'
import LoggerFactory from './util/loggerFactory'
import { config } from './applicationContext'

import * as handlers from './handlers'
import { Http } from 'winston/lib/winston/transports';

const HTTP = require('http');

const logger = LoggerFactory.getLogger()
const server = new Hapi.Server()

logger.info('Starting server...')

server.connection({ port: config.server.port })

const httpsEnabled = config.server.https.enabled === true
if (httpsEnabled) {
    const httpsPort = config.server.https.port
    const tls = {
        key: fs.readFileSync(path.join(process.cwd(), config.server.https.keyPath)),
        cert: fs.readFileSync(path.join(process.cwd(), config.server.https.certPath)),
    }
    server.connection({ port: httpsPort, tls })
}

// Add plugin to gather and expose metrics for prometheus (adds a /metrics route)
epimetheus.instrument(server);

// register i18n plugin
server.register(
    {
        register: i18n,
        options: {
            locale_path: path.join(process.cwd(), '/i18n'),
            cookie_name: 'language',
            default_language: 'EN',
            available_languages: ['EN']
        }
    }
    , handlers.errorHandler)

// register view plugin
server.register(Vision, function (err) {
    var ptls = {};

    server.views({
        engines: {
            html: {
                compile: function (tpl) {

                    Mustache.parse(tpl)

                    return function (context) {
                        return Mustache.render(tpl, context, ptls)
                    }
                },

                registerPartial: function (pName, src) {
                    ptls[pName] = src
                }
            }
        },
        relativeTo: __dirname,
        path: 'tpl'
    })
})

server.register({
    register: require('./auth/bkAuth'),
    options: {
        enabled: config.auth.enabled,
        ssoUrl: config.auth.ssoUrl,
        cookieTtl: config.auth.cookieTtl,
        cookieUserKey: config.auth.cookieUserKey,
        cookieSSOTokenIsSecure: config.auth.cookieSSOTokenIsSecure,
        bkUid: config.auth.bkUid,
        bkSecretKey: config.auth.bkSecretKey,
        bkServicesBaseUrl: config.auth.bkServicesBaseUrl,
        fakeAccount: config.auth.fakeAccount,
        allowedPaths: ['/metrics', '/status'] // skip authentication for these paths
    }
},
    function (err) {
        if (err) {
            logger.error('Failed to Auth plugin: ' + err)
            throw err
        }
    }
)

// Session Data Routes
server.register(
    [
        require('./api/session.js')
    ],
    {
        routes: { prefix: '/api/session' }
    },
    function (err) {
        if (err) {
            logger.error('Failed load session API routes: ' + err)
            throw err
        }
        logger.info('Loaded session API routes')
    }
)

// Report Data Routes
server.register(
    [
        require('./api/reports.js')
    ],
    {
        routes: { prefix: '/api/reports' }
    },
    function (err) {
        if (err) {
            logger.error('Failed load reports API routes: ' + err)
            throw err
        }
        logger.info('Loaded reports API routes')
    }
)

// Simple route that responds with 200 - 'OK' (used for health checks and load balancers)
server.route({
    method: 'GET',
    path: '/status',
    handler: (request, reply) => {
        reply('OK')
    }
})

// add server-side routes
server.register(Inert, function (err) {
    server.route(routes)
})


logger.info(`HTTP listening on port ${config.server.port}`)
if (config.server.https.enabled === true) {
    logger.info(`HTTPS listening on port ${config.server.https.port}`)
}

module.exports = server
