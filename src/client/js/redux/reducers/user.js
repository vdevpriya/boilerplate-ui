import initialState from '../state'

export default function user(state = initialState.user, action) {
    switch(action.type) {
        case 'SET_USER_DETAILS':
            return {
                ...state,
                ...(action.user)
            }
        default:
            return state
    }
}