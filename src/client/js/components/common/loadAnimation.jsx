//Displays a circular loading icon using CSS.
//Size is optional, default value is 50
import React from 'react'

class LoadAnimation extends React.Component {
    render() {
        return (
            <div id='animation-container'>
                <div className='loader' />
            </div>
        )
    }
}

export default LoadAnimation