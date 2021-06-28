import ApplicationContext from '../applicationContext'
import RequestUtil from '../util/requestUtil'

/*
 * Frequency related API routes
 */
exports.register = function(server, options, next) {
    const dataService = ApplicationContext.getDataService()
    server.route([
        {
            method: 'GET',
            path: '/reach',
            handler: function(request, response) {
                let query = request.query,
                    partnerId = RequestUtil.getPartnerId(request),
                    aggregationLevel = query['aggregationLevel'],
                    selectedIds = query['selectedIds']


                if (!partnerId || !aggregationLevel) {
                    response("partnerId and aggregationLevel must be specified").code(400)
                } else {
                    let opts = { selectedIds, verbose: true }

                    dataService.getReachData(partnerId, aggregationLevel, opts)
                        .then(data => {
                            response(data)
                        })
                        .catch(error => {
                            console.error(`Error getting ${aggregationLevel} reach data for partner ${partnerId} => ERROR: ${error}`)
                            response(JSON.stringify(error)).code(500)
                        })
                }
            }
        },
        {
            method: 'GET',
            path: '/frequency',
            handler: function(request, response) {
                const query = request.query
                const partnerId = RequestUtil.getPartnerId(request)


                const aggregationId = query['aggregationId']
                const aggregationLevel = query['aggregationLevel']

                if (!partnerId || !aggregationId || !aggregationLevel) {
                    response("partnerId, aggregationId and aggregationLevel must be specified").code(400)
                } else {
                    dataService.getFrequencyData(partnerId, aggregationId, aggregationLevel)
                        .then(data => {
                            response(data)
                        })
                        .catch(error => {
                            console.error(`Error getting ${aggregationLevel} frequency data for partner ${partnerId} => ERROR: ${error}`)
                            response(JSON.stringify(error)).code(500)
                        })
                }
            }
        }
    ])
    next()
}

exports.register.attributes = {
    name: 'reports'
}
