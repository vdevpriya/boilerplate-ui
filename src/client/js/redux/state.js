/*
    This is the object that describes the shape of your app - user data, application state that is more than simply visual
    For visual-only changes, use the components' props.
*/

const state = {
  user: {
    ssoToken: null,
    username: null,
    partnerName: null,
    partnerId: -1,
    roles: [],
    permissions: []
  },

  config: {
    appTitle: 'SaaS-BLR Demo'
  },

  // These are misc session data that may be used in different parts of the UI.
  // This data may be specific to the current logged-in user/partner (i.e. session)
  session: {
    lastClosed: {},
    aggregationLevels: [
      {
        label: 'Campaign',
        value: 'campaign'
      }, {
        label: 'Site',
        value: 'site'
      }
    ],
    lookbacks: [
      {
        label: '30 Days',
        value: '30'
      }, {
        label: '90 Days',
        value: '90'
      }
    ],
    metrics: [
      {
        label: 'Impressions',
        value: 'impressions'
      }, {
        label: 'User IDs',
        value: 'unique_users_impressed'
      }, {
        label: 'Clicks',
        value: 'clicks'
      }, {
        label: 'Conversions',
        value: 'conversions'
      }
    ]
  }
}

export default state
