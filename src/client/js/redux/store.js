/*
   This combines reducers, our initial state object, routing, and middleware
   that allows us to make async calls with Redux.  It returns our store, which
   we sync to our browserHistory in index.jsx
*/

import thunk from 'redux-thunk' //allows us to pass functions as actions, ie, make ajax calls
import initialState from './state'
import app from './reducers'

import { combineReducers, createStore, applyMiddleware } from 'redux'

const store = createStore(
    app,
    initialState,
    applyMiddleware(thunk)
)

export default store
