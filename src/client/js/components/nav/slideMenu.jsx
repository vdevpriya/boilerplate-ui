import React from 'react'
import classNames from 'classnames'
import NavItem from './navItem'


class SlideMenu extends React.Component {

    constructor() {
        super()
    }

    componentDidMount() {
    }

    render() {
        return (
            <div id="slide-menu">
                <ul className="clear nav-container">
                    {/* <NavItem to="/feeRules" defaultMessage="Fee Rules" />
                    <NavItem to="/preview" defaultMessage="Preview" /> */}
                </ul>
            </div>
        )
    }
}

export default SlideMenu
