import SignatureUtil from '../util/signatureUtil'
import fetch from 'node-fetch'
import url from 'url'
import prometheus from 'prom-client'

const METRIC_TARGET = 'rf_data_api' // reach and frequency data APIs

const metric = {
    duration: new prometheus.Summary({ name: 'api_call_duration_milliseconds', help: 'request duration in milliseconds', labelNames: ['target', 'host', 'pathname', 'status'] }),
    buckets: new prometheus.Histogram({ name: 'api_call_buckets_milliseconds', help: 'request duration buckets in milliseconds. Bucket size set to 500 and 2000 ms to enable apdex calculations with a T of 300ms', labelNames: ['target', 'host', 'pathname', 'status'], buckets: [ 500, 2000 ] })
}

const _observe_api_call = (host, pathname, statusCode, start) => {
    const duration = Date.now() - start

    metric.duration.labels(METRIC_TARGET, host, pathname, statusCode).observe(duration)
    metric.buckets.labels(METRIC_TARGET, host, pathname, statusCode).observe(duration)
}

/**
 * Client for accessing the API for retrieving data.
 *
 * See API documentation: http://docs.dmp-analytics-api-prd.valkyrie.net/
 */
class ApiClient {
    /**
     * @param clientId - 3amp clientId  associated with service ccount
     * @param clientSecret - 3AMP clientSecret associated with service ccount
     * @param baseUrl - protocol, host and port (optional) used as a URL prefix for various service endpoints (e.g. http://service.bluekai.com:80)
     */
    constructor(clientId, clientSecret, baseUrl) {
      this.signatureUtil = new SignatureUtil(clientId, clientSecret)
      this.baseUrl = baseUrl
    }

    /**
     * @return a Promise object that eventually resolves to the response data or an error
     */
    getAllPartnerData() {
        return this._signAndFetch('GET', `${this.baseUrl}/partners`)
    }

    /**
     * @param partnerId  - (required) ID of partner to return available data for
     * @param options - (optional) hash containing extra parameters expected by the service including:
     *   period_length - Time period (30/90 days). Default is 30 days.
     *   campaign_ids - List of campaigns to return data for
     *   sort - sorting on a particular field (conversions, impressions, clicks, unique_users). Note that '-FIELD’ will return results in descending order, while FIELD would return ascending order.
     *   verbose - (default false) list of ids only, true: list of full campaign objects
     * @return a Promise object that eventually resolves to the response data or an error
     */
    getAllCampaignData(partnerId, options = {}) {
        if (!partnerId) throw 'partnerId must be specified'

        // set the default options with the complete list of expected attributes
        const defaultOptions = {
            period_length: null,
            campaign_ids: [],
            sort: ['-impressions'],
            verbose: false,
            offset: null,
            limit: null
        }

        const target = url.parse(`${this.baseUrl}/partners/${partnerId}/campaigns`)
        target.query = this._mergeOptions(defaultOptions, options)
        const targetUrl = url.format(target)
        return this._signAndFetch('GET', targetUrl)
    }

    /**
     * Get data for a specific campaign
     */
    getCampaignData(partnerId, campaignId, period_length = null) {
        if (!partnerId || !campaignId) throw 'Both partnerId and campaignId must be specified'

        const target = url.parse(`${this.baseUrl}/partners/${partnerId}/campaigns/${campaignId}`)
        target.query = period_length ? { period_length } : {}

        const targetUrl = url.format(target)
        return this._signAndFetch('GET', targetUrl)
    }

    /**
     * @param partnerId  - (required) ID of partner to return available data for
     * @param options - (optional) hash containing extra parameters expected by the service including:
     *   period_length - Time period (30/90 days). Default is 30 days.
     *   campaign_ids - List of campaigns to return data for
     *   sort - sorting on a particular field (conversions, impressions, clicks, unique_users). Note that '-FIELD’ will return results in descending order, while FIELD would return ascending order.
     *   verbose - (default false) list of ids only, true: list of full campaign objects
     * @return a Promise object that eventually resolves to the response data or an error
     */
    getAllSiteData(partnerId, options = {}) {
        if (!partnerId) throw 'partnerId must be specified'
        // set the default options with the complete list of expected attributes
        const defaultOptions = {
            period_length: null,
            campaign_ids: [],
            sort: ['-impressions'],
            verbose: false,
            offset: null,
            limit: null
        }

        const target = url.parse(`${this.baseUrl}/partners/${partnerId}/sites`)
        target.query = this._mergeOptions(defaultOptions, options)

        const targetUrl = url.format(target)
        return this._signAndFetch('GET', targetUrl)
    }

    /**
     * @param partnerId  - (required) ID of partner to return available data for
     * @param options - (optional) hash containing extra parameters expected by the service including:
     *   period_length - Time period (30/90 days). Default is 30 days.
     *   campaign_ids - List of campaigns to return data for
     *   sort - sorting on a particular field (conversions, impressions, clicks, unique_users). Note that '-FIELD’ will return results in descending order, while FIELD would return ascending order.
     *   verbose - (default false) list of ids only, true: list of full campaign objects
     * @return a Promise object that eventually resolves to the response data or an error
     */
    getOverlapData(partnerId, options = {}) {
        if (!partnerId) throw 'partnerId must be specified'
        // set the default options with the complete list of expected attributes
        const defaultOptions = {
            period_length: null,
            sort: ['-impressions'],
            offset: null,
            limit: null,
            aggregationLevel: 'campaign'
        }

        let target = url.parse(`${this.baseUrl}/partners/${partnerId}/${options.aggregationLevel}-overlaps`)
        target.query = this._mergeOptions(defaultOptions, options)

        const targetUrl = url.format(target)
        return this._signAndFetch('GET', targetUrl)
    }

    /**
     * Get data for a specific site
     */
    getSiteData(partnerId, siteId, period_length = null) {
        if (!partnerId || !siteId) throw 'Both partnerId and siteId must be specified'

        const target = url.parse(`${this.baseUrl}/partners/${partnerId}/sites/${siteId}`)
        target.query = period_length ? { period_length } : {}

        const targetUrl = url.format(target)
        return this._signAndFetch('GET', targetUrl)
    }

    _signAndFetch(httpMethod, targetUrl) {
        const signatureData = this.signatureUtil.getSignatureData(httpMethod, targetUrl)
        const options = {
            method: httpMethod,
            headers: {}
        }
        signatureData.headers.forEach((value, key) => options.headers[key] = value)
        return this._performFetch(targetUrl, options)
    }

    _performFetch(targetUrl, options, host, pathname) {
        return new Promise((resolve, reject) => {
            const urlObject = url.parse(targetUrl)
            const start = Date.now()

            fetch(targetUrl, options)
                .then(response => {
                    _observe_api_call(urlObject.host, urlObject.pathname, response.status, start)
                    if (response.status == 200) {
                        return response.json()
                            .then(data => resolve(data))
                            .catch(error => {
                                console.error(`Error converting response to JSON => ERROR: ${error}`)
                                return reject(error)
                            })
                    } else {
                        return response.text()
                            .then(txt => {
                                return reject(`${targetUrl} => returned: (${response.status}) ${txt}`)
                            })
                            .catch(error => {
                                return reject(`${targetUrl} =>returned: (${response.status}) *could not get response body*`)
                            })
                    }
                })
                .catch(error => {
                    console.error(`Error accessing ${targetUrl} => ERROR: ${error}`)
                    reject(error)
                })
        })
    }

    /**
     * Merge the values of oldOptions and newOptions (newOption values will override oldOption values)
     * and return the new merged options.
     * Keep only the 'keys' from oldOptions (guard against unexpected options being injected to API call).
     * Also removes empty values so they are not passed in to the API unnecessarily.
     *
     * @oldOptions
     * @newOptions
     * @return the new merged options
     */
    _mergeOptions(oldOptions, newOptions) {
        const origKeys = new Set(Object.keys(oldOptions))
        const mergedOptions = { ...oldOptions, ...newOptions }

        Object.keys(mergedOptions).forEach( (key) => {
            if (!origKeys.has(key)) {
                console.error(`Unexpected options parameter "${key}" will be removed.  This should never happen - please investigate.`) // this should not happen
            }
            const value = mergedOptions[key]
            if (!origKeys.has(key) || !value || (Array.isArray(value) && value.length == 0)) delete mergedOptions[key];
        })
        return mergedOptions
    }
}

export default ApiClient