import http from 'http'
import url from 'url'
import dateFormat from 'dateformat'
import CryptoJS from 'crypto-js'

class SignatureUtil {
  static VALID_PROTOCOLS = new Set(['http:', 'https:'])
  static VALID_METHODS = new Set(['GET', 'POST', 'PUT', 'DELETE'])
  static DATE_FORMAT = "GMT:ddd, dd mmm yyyy HH:MM:ss Z"

  /**
   * @param clientId - 3AMP clientId
   * @param secretKey - 3AMP secretKey
   */
  constructor(clientId, secretKey) {
    this.clientId = clientId
    this.secretKey = secretKey
  }

  getSignatureData(httpMethod, urlString) {
    const urlObject = url.parse(urlString, true) // true to make sure urlObject.query is a hash

    if (! SignatureUtil.VALID_METHODS.has(httpMethod)) {
        throw 'Invalid http method: ' + httpMethod
    }
    if (! SignatureUtil.VALID_PROTOCOLS.has(urlObject.protocol)) {
        throw 'Invalid protocol: ' + urlObject.protocol
    }

    let formattedDate = dateFormat(new Date(), SignatureUtil.DATE_FORMAT)
    let signingStr = (httpMethod + urlObject.pathname + urlObject.host + formattedDate).toLowerCase()
    let signature = CryptoJS.HmacSHA256(signingStr, this.secretKey).toString(CryptoJS.enc.Base64)
    let authorizationHeader = `3AMP version="1",keyId="${this.clientId}",headers="(resource-target) host date",` +
      `algorithm="hmac-sha256",signature="${signature}"`

    return {
      url: urlString,
      signingStr,
      signature,

      headers: new Map([
        ["Date", formattedDate],
        ["Authorization", authorizationHeader]
      ])
    }
  }
}

export default SignatureUtil
