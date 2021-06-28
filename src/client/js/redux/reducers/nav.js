import initialState from '../state'

export default function nav (state = initialState.app.nav, action) {
    if (action.type === 'LOAD_NAV') {
        var newNav = action.navName ? action.navName : state.defaultNav

        return {
            ...state,
            currentNav: newNav
        }
    }

    if (action.type === 'PREV_NAV') {
        var prevNav = state.previousNav.length ? state.previousNav : state.defaultNav
        return {
            ...state,
            currentNav: prevNav,
            previousNav: []
        }
    }

    return state
}