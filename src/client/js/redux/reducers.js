// common reducers live here, import components in store.js from ./reducers/[component]
import { combineReducers } from 'redux'

//component reducers
import user from './reducers/user'
import config from './reducers/config'
import session from './reducers/session'

//common reducers
const app = combineReducers({
    config,
    user,
    session
})

export default app
