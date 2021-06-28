import ApiClient from './service/apiClient'
import DataService from './service/dataService'

const environment = process.env.NODE_ENV || 'dev'
// console.log(`Environment: ${environment}`)

// TODO: prepare the config here (i.e. if we have to merge common configs with environment-specific configs), then make it available.
export const config = require(`../../config/${environment}.json`)

/**
 * This is our application bean factory which takes care of configuring
 * and returning services as well as configuration values.
 *
 *
 */
class ApplicationContextInstance {

    getDataService() {
        const apiClient = new ApiClient(config.data.api.clientId, config.data.api.clientSecret, config.data.api.baseUrl)
        return new DataService(apiClient)
    }
}

const ApplicationContext = new ApplicationContextInstance()
export default ApplicationContext
