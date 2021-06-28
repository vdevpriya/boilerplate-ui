/*
    This is the entry point of our app.  We wrap everything in a provider
    and pass the store to make our Redux store available to any component,
    and connect it with the browser's history so that the two aren't ever
    out of sync.  Check out https://github.com/reactjs/react-router-redux
    for more info.

    Underneath this, we wrap the application in an IntlProvider, which allows
    us to use pseudolocalization. Our pseudolocalization json is stored in ./i18n.
    Check out https://github.com/yahoo/react-intl for more info.

    Everything beneath this is the shape of the routes in our app and is fairly self-
    explanatory.  Please see https://github.com/reactjs/react-router for more detail.

    Oh, one thing to note: React components MUST start with an uppercase letter.
    They should be exported as such and imported the same way.

*/

import './polyfill'
import React from 'react'
import ReactDOM from 'react-dom'

import Header from './components/app/header'
import SlideMenu from './components/nav/slideMenu'
import ErrorComponent from './components/common/error'

import store from './redux/store'
import { initializeSessionData } from './redux/actions/session'

import { BrowserRouter, Route, Switch, NavLink, Redirect } from 'react-router-dom'
import { Provider } from 'react-redux'
import { IntlProvider } from 'react-intl/lib/index.es.js'
import { Select } from 'alta-react-components'

var languageMessages = {}
languageMessages['es'] = require('../../../i18n/es')

class App extends React.Component {

  constructor() {
    super()

    this.state = {
    }
  }

  onChange= () => {
    alert("Hi There");
  }

  componentWillMount() {}

  componentDidMount() {}

  render() {

    const language = (navigator.language || navigator.browserLanguage).split('-')[0];
    const messages = languageMessages[language] || {};
    return (
      <Provider store={store}>
        <IntlProvider locale={language} messages={messages}>
          <BrowserRouter>
            {/* <div id='slide-menu-container'> */}
              <div id='app-content' className='open'>
                <Header />
                <div id='main-content' className='clear'>
                  <div id="report-container" className="clear">
                    <div style={{ height: 'calc(100vh - 65px)', overflow: 'scroll' }}>
                    <h1>Welcome to boiler-plate-ui!</h1>
                    <Select
                        options={[
                          {label: 'Storm',value: 'Storm'},
                          {label: 'Thor',value: 'Thor'},
                          {label: 'Thing',value: 'Thing'},
                        ]}
                        onChange={this.onChange.bind(this)}
                        placeholder="Go ahead, I dare ya"
                        label={false}
                        isMulti={false}
                        positionAbsoluteOptions={false}
                        error={false}
                        isDisabled={false}
                      />
                    </div>
                  </div>
                </div>
              {/* </div> */}
            </div>
          </BrowserRouter>
        </IntlProvider>
      </Provider>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'))
