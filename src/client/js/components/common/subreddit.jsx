import React from 'react'
import classNames from 'classnames'
import Post from './post'
import LoadAnimation from './loadAnimation'

import { connect } from 'react-redux'
import { fetchSubreddit } from '../../redux/actions'

const mapStateToProps = function(state) {
    return {
        app: state.app,
        subreddit: state.app.subreddit
    }
}

class Subreddit extends React.Component {

    static defaultProps = {
        defaultSubreddit: 'javascript'
    }

    constructor() {
        super()
    }

    componentDidMount() {
        // you dispatch actions that are functions
        if (!this.props.subreddit.posts.length) {
            this.props.dispatch(fetchSubreddit(this.props.defaultSubreddit))
        }
    }

    render() {

        /* 
            we add fadeins to async components by adding the 
            classname 'async' and then conditionally adding 
            the classname 'fetching', based on the state of the component

        */ 

        let fetchClass = classNames('async', {
                'fetching': this.props.subreddit.fetching
            }),
            posts = this.props.subreddit.posts

        return (
            <div id="subreddit">
                <div className={fetchClass}>    
                    {posts.map((post) => {
                        return (
                            <Post key={post.data.id} {...post}/>
                        )
                    })}
                </div>
                {posts.length ? false : 
                    <LoadAnimation />
                }
            </div>
        )
    }
}

Subreddit = connect(mapStateToProps)(Subreddit)

export default Subreddit
