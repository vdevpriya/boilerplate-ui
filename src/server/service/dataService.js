import { logger } from '../util/loggerFactory'

/**
 * Business layer for getting the data and transforming/shapping it for use upstream.
 */
class DataService {

    // TODO: move to a more central location?
    static VALID_AGGREGATION_LEVELS = new Set(['campaign', 'site'])

    constructor(apiClient) {
        this.apiClient = apiClient
    }

    /**
     * Returns campaigns for the given partner.
     * e.g.
     * [
     *   { id: 123, name: 'Campaign-A'},
     *   { id: 456, name: 'Campaign-B'},
     * ]
     * @return a Promise for a list of campaigns
     */
    getCampaigns(partnerId, opts) {
        let payload = opts ? opts : {}
        payload.verbose = true
        return this._constructList(this.apiClient.getAllCampaignData(partnerId, payload))
    }

    /**
     * Returns sites for the given partner.
     * e.g.
     * [
     *   { id: 123, name: 'Site-A'},
     *   { id: 456, name: 'Site-B'},
     * ]
     * @return a Promise for a list of sites
     */
    getSites(partnerId, opts) {
        let payload = opts ? opts : {}
        payload.verbose = true
        return this._constructList(this.apiClient.getAllSiteData(partnerId, payload))
    }


    /**
     * Returns campaign overlaps for the given partner.
     * e.g.
     * [
     *   { id: 123, name: 'Site-A'},
     *   { id: 456, name: 'Site-B'},
     * ]
     * @return a Promise for a list of overlaps
     */
    getCampaignOverlaps(partnerId, opts) {
        let payload = opts ? opts : {}
        payload.aggregationLevel = 'campaign'
        return this._constructList(this.apiClient.getOverlapData(partnerId, payload))
    }

    /**
     * Returns site overlaps for the given partner.
     * e.g.
     * [
     *   { id: 123, name: 'Site-A'},
     *   { id: 456, name: 'Site-B'},
     * ]
     * @return a Promise for a list of overlaps
     */
    getSiteOverlaps(partnerId, opts) {
        let payload = opts ? opts : {}
        payload.aggregationLevel = 'site'
        return this._constructList(this.apiClient.getOverlapData(partnerId, payload))
    }

    _constructList(promise) {
        return new Promise((resolve, reject) => {
            promise.then(result => {
                    const data = result['data']
                    resolve(data)
                })
                .catch(error => {
                    reject(error)
                })
        })
    }

    _pctSafe(numerator, denominator) {
        return (numerator == 0 || denominator == 0) ? 0.0 : numerator * 100.0 / denominator
    }
}

export default DataService