import React from 'react'

import { NavLink } from 'react-router-dom'


class NavItem extends React.Component {

    constructor() {
        super()
    }

    render() {
        return (
            <li className="clear">
                <NavLink activeClassName="active" className="nav-link" exact to={this.props.to}>
                    {this.props.defaultMessage}
                </NavLink>
            </li>
        )
    }
}

export default NavItem
