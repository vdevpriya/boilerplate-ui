import React from 'react'
import classNames from 'classnames'
import shortId from 'shortid'
import NavItem from './navItem'

import { FormattedMessage } from 'react-intl'

class NavDropDown extends React.Component {

    constructor() {

        super()

        this.toggleNav = this.toggleNav.bind(this)

        this.state = {
            open: false
        }

    }

    toggleNav() {
        this.setState({
            open: !this.state.open
        })
    }

    render() {
        var toggleClass = classNames('nav-link', {closed: !this.state.open, open: this.state.open}),
            toggleNav = this.toggleNav
        return (
           <li className="clear">
                <div className={toggleClass} onClick={toggleNav}>
                    {this.props.defaultMessage}
                </div>
                <ul className="child-nav">
                    {this.props.children.map(subNavItem => {
                        return <NavItem {...subNavItem.props} key={shortId.generate()} />
                    })}
                </ul>
            </li>
        )
    }
}

export default NavDropDown
