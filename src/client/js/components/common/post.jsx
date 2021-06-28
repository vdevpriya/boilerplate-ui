import React from 'react'

class Post extends React.Component {

    render() {

        return (
            <div className='col-md-4 post'>
                <a className='post-title' href={this.props.data.url} target="_new">
                    {this.props.data.title}
                </a>
                <br />
                <span>{this.props.data.author}</span>
                <hr />
            </div>
        )
    }
}

export default Post