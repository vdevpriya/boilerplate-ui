import initialState from '../state'

export default function subreddit (state = initialState.app.subreddit, action) {
    if (action.type === 'REQUEST_SUBREDDIT') {
        return {
            ...state,
            fetching: true
        }
    }
    if (action.type === 'RECEIVE_SUBREDDIT') {
        return {
            ...state,
            fetching: false,
            posts: action.subreddit.data.children
        }
    }
    else {
        return state
    }
}
