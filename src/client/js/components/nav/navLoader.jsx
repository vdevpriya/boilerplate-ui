import React from 'react'

import { FormattedMessage } from 'react-intl'

class NavLoader extends React.Component {

    constructor() {
        super()
    }

    render() {
        return (
            <li className="clear">
                <div className="nav-link nav-loader" onClick={() => this.props.loadNav(this.props.to)} >
                    <FormattedMessage
                        id={this.props.textLink}
                        defaultMessage={this.props.defaultMessage}
                        />
                </div>
            </li>
        )
    }
}

export default NavLoader
