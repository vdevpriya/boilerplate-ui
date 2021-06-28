/*
    How to make an ajax call using redux methodology

    1. Call dispatch(fetchRepos()) from anywhere in your workflow; in TestComponent, we call it in componentWillMount()
    2. FetchRepos() in turn calls requestRepos(), which passes itself to the reducer function repos, called in reducers.js
    3. RequestRepos() updates the state (in this case, setting fetching:true)
    4. Meanwhile, fetchRepos() uses isomorphic fetch to actually request the data
    5. Once data is returned, receiveRepos() is called and passed the returned json as an argument
    6. ReceiveRepos() updates the state to its final form (in this case, fetching is now false again)
*/

export function requestSubreddit () {
    return {
        type: 'REQUEST_SUBREDDIT'
    }
}

export function fetchSubreddit (subreddit) {

    // note - for string interpolation, use ` (backtick) instead of ' (quote)!
    const url = `https://www.reddit.com/r/${subreddit}.json`
    return dispatch => {
        dispatch(requestSubreddit())
        return fetch(url)
        .then(response => response.json())
        .then(
            json => (dispatch(receiveSubreddit(json)))
        )
    }
}

function receiveSubreddit (subreddit) {
    return {
        type: 'RECEIVE_SUBREDDIT',
        subreddit
    }
}
