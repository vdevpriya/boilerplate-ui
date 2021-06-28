import React from 'react'
import Header from './header'
import SlideMenu from '../nav/slideMenu'
import ErrorComponent from '../common/error'

class AppContainer extends React.Component {

    constructor() {
        super()
        this.state = { open: false }
    }

    toggleMenu = () => {
        this.setState({
            open: !this.state.open
        })
    }

    componentWillMount() {
    }

    render() {
        var menuToggleState = this.state.open ? 'open' : ''

        return (
            <div id='slide-menu-container' className={menuToggleState}>
                <SlideMenu {...this.props} />
                <div id='app-content' className='open'>
                    <Header toggleMenu={this.toggleMenu} />
                    <ErrorComponent />
                    <div id="main-content" className="clear">
                        {this.props.children}
                    </div>
                </div>
            </div>
        );
    }
}

export default AppContainer
