import React from 'react'

import { NavLink } from 'react-router-dom'

import Subreddit from './subreddit'

class TestComponent extends React.Component {

    render() {
        return (
            <div className='home-content'>
                <Subreddit />
                <h1>
                    <NavLink className='nav-link' to='/'>
                        Back
                    </NavLink>
                </h1>
            </div>
        )
    }
}

export default TestComponent
