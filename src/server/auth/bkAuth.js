/*
 * Hapi plugin that registers an authentication scheme
 * that supports BlueKai SSO.
 */
'use strict'

import boom from 'boom'
import querystring from 'querystring'
import hoek from 'hoek'
import joi from 'joi'
import url from 'url'
import { UserAuthClient } from 'bk-client-js'
import LoggerFactory from '../util/loggerFactory'
import fetch from 'isomorphic-fetch'

const AUTH_SCHEME = 'bkAuth'
const AUTH_STRATEGY = 'bkAuth'
const LOGOUT_PATH = '/logout'

const logger = LoggerFactory.getLogger('BKAuth')

var internals = {}

// TODO: Move to a utility class
const get_home_url = function(request) {
    return request.connection.info.protocol
        + '://'
        + request.info.host // this includes port number as well
}

// TODO: Move to a utility class
const get_current_url = function(request) {
    return get_home_url(request) + request.url.path
}

/*
 * Register auth scheme with Hapi and set this as the default auth strategy.
 */
exports.register = function (server, options, next) {

    server.auth.scheme(AUTH_SCHEME, internals.implementation)

    logger.info('Auth enabled: ' + options.enabled)
    if (options.enabled) {
        logger.info('Auth SSO Url.   : ' + options.ssoUrl)
        logger.info('Auth Cookie TTL : ' + options.cookieTtl)
    }

    // Register this auth strategy to be applied to all routes by default
    server.auth.strategy(AUTH_STRATEGY, AUTH_SCHEME, true, options)

    server.route([
        {
            method: 'GET',
            path: '/login',
            handler: function(request, reply) {
                logger.info('/login...')
                if (request.auth.isAuthenticated) {
                    logger.info('Already authenticated')
                }
                reply.redirect('/')
            }
        },
        {
            method: 'GET',
            path: LOGOUT_PATH,
            handler: function(request, reply) {
                // It shouldn't really get here because auth should have redirected to SSO login already
                reply(boom.badImplementation('Logout should have forwarded user to SSO login page'), null)
            }
        }
    ])

    next()
}

exports.register.attributes = {
    name: 'bkAuthPlugin'
}

/*
 * Used to validate and set default values for the
 * config options for this plugin.
 */
internals.configSchema = joi.object({
    enabled: joi.boolean().default(true),
    ssoUrl: joi.string().default('https://partner.bluekai.com/Login'), // dmpsandbox is master (stable), dmpsoak is develop
    ssoRedirectParam: joi.string().default('redirect_uri'),
    ssoTokenQueryParamKey: joi.string().default('bksso'),      // query string param key used by SSO login site when redirecting back after successful login
    cookieSSOTokenKey: joi.string().default('bksso'),          // must match token key in BlueKaiAuth
    cookieSSOTokenIsSecure: joi.boolean().default(true),       // true requires HTTPS to be enabled for the cookie to be available
    bkUid: joi.string().default('not-specified'),
    bkSecretKey: joi.string().default('not-specified'),
    bkServicesBaseUrl: joi.string().default('https://services.bluekai.com'), // service for verifying SSO token
    cookieSSOTokenDomain: joi.string().default('bluekai.com'), // must be bluekai.com so other apps (e.g. wunderbar) can get and validate SSO token and validate
    cookieUserKey: joi.string().default('user'),
    cookieTtl: joi.number().integer().min(0).default(1000 * 60 * 60 *4), // default 4 hours
    fakeAccount: joi.object().default({}),
    allowedPaths: joi.array().items(joi.string()) // paths that match the specified strings or regexes will be allowed to pass through (TODO: support RegExp)
}).required()


internals.implementation = function (server, options) {
    const results = joi.validate(options, internals.configSchema)
    hoek.assert(!results.error, results.error)
    // logger.info("Results : "+JSON.stringify(results));
    const config = results.value
    logger.info("config.bkServicesBaseUrl : "+config.bkServicesBaseUrl);
    const userAuthClient = new UserAuthClient(config.bkUid, config.bkSecretKey, config.bkServicesBaseUrl)
    const allowedPaths = config.allowedPaths ? new Set(config.allowedPaths) : null

    // Cookie holding the BK SSO token. Must conform to standard BK SSO
    // settings for cross-site authentication to work.
    server.state(config.cookieSSOTokenKey, {
        ttl: config.cookieTtl,
        domain: config.cookieSSOTokenDomain,
        encoding: 'none',
        isSecure: config.cookieSSOTokenIsSecure,   // true to allow access only if HTTPS
        isHttpOnly: false,
        clearInvalid: false,
        path: '/'
    })

    // user account details cookie
    server.state(config.cookieUserKey, {
        ttl: config.cookieTtl,
        encoding: 'base64json',
        isSecure: false,
        isHttpOnly: false, // false so it can be accessed client side until we force HTTPS
        clearInvalid: false,
        path: '/'
    })


    /**
     * Returns a stubbed user account
     * used when this plugin is not enabled (!config.enabled) i.e. development environments (no SSO login required)
     */
    const getFakeAccount = function(ssoToken) {
      // logger.info("Getting Fake Account")
        let fakeAccount = config.fakeAccount
        fakeAccount.token = ssoToken
        return fakeAccount
    }

    const getAuthenticatedAccount = function(request, ssoToken) {
        const account = request.state[config.cookieUserKey] || null
        // verify ssoToken matches what's in account
        // (user may have logged out and logged back in as different user/partner)
        if (account && account.token !== ssoToken) {
            logger.info("Returning null")
            return null
        }
        logger.info("Returning account : "+account)
        return account
    }

    const redirectToSSOLogin = function(request, reply, redirectToHome = false) {
        // For guarding data integrity, forward the user to the home page if the original request is not a GET
        // This means any form submissions or delete/update requests will not be resubmitted if user is not logged in.
        const comebackUrl = redirectToHome || request.method !== 'get' ? get_home_url(request) : get_current_url(request);

        const redirect_uri = config.ssoUrl + '?' + querystring.stringify({ redirect_uri : comebackUrl })
        reply.redirect(redirect_uri)
    }

    /*
     * SSO token can be passed in as a query string parameter (if redirecting successfully from SSO login page)
     * or may already be available as a cookie (if already logged in via other sites)
     */
    const findToken = function(request) {
        if (request.query[config.ssoTokenQueryParamKey]) {
            return request.query[config.ssoTokenQueryParamKey]
        } else if (request.state[config.cookieSSOTokenKey]) {
            // SSO token value in the cookie is URI-encoded for some reason
            return decodeURIComponent(request.state[config.cookieSSOTokenKey])
        }
        return null
    }

    /*
     * Verify the token and get acccount details associated with the token.
     * See https://dstreet.datalogix.com/display/DMPT/BlueKai+User+Authorization
     *
     * @returns user account details
     */
    const verifyToken = function (ssoToken) {
        logger.info('Validating token: ' + ssoToken)

        return new Promise((resolve, reject) => {
            userAuthClient.authorize(ssoToken, (error, userAccount) => {
                if (error) {
                    logger.info('Error Validating token: ' + ssoToken)
                    return reject(`Error validating token ${ssoToken} => ${error}`)
                } else {
                    return resolve(userAccount)
                }
            })
        })
    }

    const clearUserAndToken = function(reply) {
        // logger.info('Clearing cookies')
        reply.unstate(config.cookieSSOTokenKey)
        reply.unstate(config.cookieUserKey)
    }

    const loggingOut = function (request, reply) {
        if (request.url.path === LOGOUT_PATH) {
            clearUserAndToken(reply)
            return true
        }
        return false
    }

    const scheme = {
        /**
         * This is the main function invoked by Hapi when routing requests.
         * Note: Even if this plugin is disabled (i.e. 'env==dev'), this will still put a fake
         *       user in the cookie so that client code can make use of it.
         */
        authenticate: function (request, reply) {
            if (loggingOut(request, reply)) {
              logger.info("Redirecting to SSO");
                redirectToSSOLogin(request, reply, true)
            } else if (allowedPaths && allowedPaths.has(request.path)) {
              logger.info("User Auth Skipped");
                reply.continue({ credentials: 'user-auth-skipped', artifacts: {} })
            } else {
                const ssoToken = config.enabled ? findToken(request) : 'fake-sso-token'
                var account = getAuthenticatedAccount(request, ssoToken)
                logger.info("ssoToken : "+ssoToken);
                logger.info("account : "+account);
                logger.info("Cheking Account");

                if (account) {
                  logger.info("Found Account");
                    replyContinueWithAccount(reply, account)
                } else if (ssoToken) {
                  logger.info("Found SSO Token : "+ssoToken);
                    if (config.enabled) {
                        verifyToken(ssoToken)
                        .then(account => {
                            setAccountData(reply, account, ssoToken, request)
                        })
                        .catch(err => {
                            logger.error('Could not verify token "' + ssoToken + '" - error:' + err)
                            clearUserAndToken(reply)
                            redirectToSSOLogin(request, reply)
                        })
                    }
                    else {
                      logger.info("Getting Fake Account");
                        account = getFakeAccount(ssoToken)
                        setAccountData(reply, account, ssoToken, request)
                    }
                } else {
                    clearUserAndToken(reply)
                    redirectToSSOLogin(request, reply)
                }
            }
        }
    }

    /**
     * Allow request to continue and pass the credentials and artifacts downstream.
     * The credentials and artifacts properties can be accessed later (in a route handler, for example) as part of the request.auth object.
     */
    function replyContinueWithAccount(reply, account) {
        let fullName = `${account.firstName} ${account.lastName}`
        // logger.info("Partner ID: ")
        // logger.info(JSON.stringify(account.partnerID));
        // reply.state('pid',account);
        return reply.continue({ credentials: fullName, artifacts: account })
    }

    /**
     * Set the account data as a cookie and then allow request to continue
     */
    function setAccountData(reply, account, ssoToken, request) {
      logger.info("Setting account data : "+account);
        if (account) {
            // Set cookie values
            if (! config.enabled) {
                // only set the cookie if we are faking it in development, otherwise BK SSO login page sets the cookie
                logger.info('Auth disabled - setting development cookie ' + config.cookieSSOTokenKey + ' to "' + encodeURIComponent(ssoToken) + '"')
                reply.state(config.cookieSSOTokenKey, encodeURIComponent(ssoToken))
            }
            // logger.info("config : "+JSON.stringify(config))
            reply.state(config.cookieUserKey, account)

            return replyContinueWithAccount(reply, account)
        } else {
            throw `Implementation error - cannot set account (${account}) data to cookie if it is not specified (ssoToken=${ssoToken})`
        }
    }

    return scheme
}
