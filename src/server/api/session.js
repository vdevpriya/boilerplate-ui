import ApplicationContext from '../applicationContext'
import RequestUtil from '../util/requestUtil'
import Boom from 'boom'

/*
 * Global session data
 */
exports.register = function(server, options, next) {
    const dataService = ApplicationContext.getDataService()
    server.route([
        {   // Get a list of campaigns for the current partner
            method: 'POST',
            path: '/campaigns',
            handler: function(request, response) {
                const partnerId = RequestUtil.getPartnerId(request),
                    payload = JSON.parse(request.payload) || null
                
                if (!partnerId) {
                    response("Cannot determine partnerId for user").code(400)
                } else {
                    dataService.getCampaigns(partnerId, payload)
                        .then(data => {
                            response(data)
                        })
                        .catch(error => {
                            console.error(`Error getting campaigns for partner ${partnerId} => ERROR: ${error}`)
                            // response(JSON.stringify(error).code(500))
                            response(Boom.serverUnavailable(`Service Unavailable: Campaigns`))
                        })
                }
            }
        },
        {   // Get a list of sites for the current partner
            method: 'POST',
            path: '/sites',
            handler: function(request, response) {
                const partnerId = RequestUtil.getPartnerId(request),
                    payload = JSON.parse(request.payload) || null

                if (!partnerId) {
                    response("Cannot determine partnerId for user").code(400)
                } else {
                    dataService.getSites(partnerId, payload)
                        .then(data => {
                            response(data)
                        })
                        .catch(error => {
                            console.error(`Error getting sites for partner ${partnerId} => ERROR: ${error}`)
                            // response(JSON.stringify(error).code(500))
                            response(Boom.serverUnavailable(`Service Unavailable: Sites`))
                        })
                }
            }
        },
        {   // Get a list of overlaps for the current partner
            method: 'POST',
            path: '/campaign-overlaps',
            handler: function(request, response) {
                const partnerId = RequestUtil.getPartnerId(request),
                    payload = JSON.parse(request.payload) || null

                if (!partnerId) {
                    response("Cannot determine partnerId for user").code(400)
                } else {
                    dataService.getCampaignOverlaps(partnerId, payload)
                        .then(data => {
                            response(data)
                        })
                        .catch(error => {
                            console.error(`Error getting campaign overlaps for partner ${partnerId} => ERROR: ${error}`)
                            // response(JSON.stringify(error).code(500))
                            response(Boom.serverUnavailable(`Service Unavailable: Campaign Overlaps`))
                        })
                }
            }
        },
        {   // Get a list of overlaps for the current partner
            method: 'POST',
            path: '/site-overlaps',
            handler: function(request, response) {
                const partnerId = RequestUtil.getPartnerId(request),
                    payload = JSON.parse(request.payload) || null

                if (!partnerId) {
                    response("Cannot determine partnerId for user").code(400)
                } else {
                    dataService.getSiteOverlaps(partnerId, payload)
                        .then(data => {
                            response(data)
                        })
                        .catch(error => {
                            console.error(`Error getting site overlaps for partner ${partnerId} => ERROR: ${error}`)
                            // response(JSON.stringify(error).code(500))
                            response(Boom.serverUnavailable(`Service Unavailable: Site Overlaps`))
                        })
                }
            }
        }
    ])
    next()
}

exports.register.attributes = {
    name: 'session'
}
