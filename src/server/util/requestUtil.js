/**
 * Helper class for processing requests.
 */
class RequestUtil {
    getPartnerId(request) {
        return request.auth.artifacts.partnerID
    }
}
const instance = new RequestUtil()

export default instance