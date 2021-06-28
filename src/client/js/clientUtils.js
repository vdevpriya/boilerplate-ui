
/**
 * Misc utils for the client.
 */
class ClientUtils {

  static performFetch = function(path, body, method = 'POST') {
      // console.log(`Calling (${method}) ${path} ${body}`)
      const options = {
          method: method,
          headers: {
            'Accept': 'application/json',
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(body),
          credentials: 'include'
      }
      if (method === 'GET' || method === 'HEAD') delete options['body']

      return fetch(path, options)
  }

    static arrayEquality = (a, b) => {
        if (a === b) return true
        if (a == null || b == null) return false
        if (a.length != b.length) return false

        for (var i = 0; i < a.length; ++i) {
            if (a[i] !== b[i]) return false
        }
        return true
    }

    static sortColumn = (a, b, desc) => {
        // force null and undefined to the bottom
        a = (a === null || a === undefined) ? -Infinity : parseInt(a, 10)
        b = (b === null || b === undefined) ? -Infinity : parseInt(b, 10)
        // force any string values to lowercase
        a = typeof a === 'string' ? a.toLowerCase() : a
        b = typeof b === 'string' ? b.toLowerCase() : b
        // Return either 1 or -1 to indicate a sort priority
        if (a > b) {
        return 1
        }
        if (a < b) {
        return -1
        }
        // returning 0 or undefined will use any subsequent column sorting methods or the row index as a tiebreaker
        return 0
    }

    static metricNames = (metric) => {
        const names = {
            impressions: 'Impressions',
            unique_users_impressed: 'User IDs',
            clicks: 'Clicks',
            conversions: 'Conversions'
        }

        return names[metric]
    }

}

export default ClientUtils
