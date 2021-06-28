import React from 'react'

import { connect } from 'react-redux'

var mapStateToProps = function (state) {
    return {
        config: state.config
    }
}

export class Header extends React.Component {

    render() {
        var appTitle = this.props.config.appTitle || '';
        return (
            <header id="header" className="lego-header">
                <div id="slide-menu-trigger" className="menu-icon"></div>
                <div className="logo"></div>
                <div className="product-name">
                    <span>{appTitle}</span>
                </div>
            </header>
        )
    }
}

export default connect(mapStateToProps)(Header)
