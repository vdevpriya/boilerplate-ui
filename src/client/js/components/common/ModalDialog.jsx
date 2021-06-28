import React from 'react';

class ModalDialog extends React.Component {
  render() {
    const modalStyle = {
      width: 500 + 'px',
      height: 'fit-content',
      position: 'fixed',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      margin: 'auto',
      zIndex: 9999,
      border: 1 + 'px solid black',
      borderRadius: 5,
      background: 'white',
      padding: 8 + 'px',
      overflowY: 'scroll'
    }

    if (this.props.isOpen === false)
      return null

    if (this.props.width) {
      modalStyle.width = this.props.width + 'px';
      // modalStyle.marginLeft = '-' + (this.props.width / 2) + 'px';
      modalStyle.transform = null;
    }

    if(this.props.height) {
      modalStyle.height = this.props.height + 'px';
      // modalStyle.marginTop = '-' + (this.props.height / 2) + 'px';
      modalStyle.transform = null;
    }

    if (this.props.style) {
      for (let key in this.props.style) {
        modalStyle[key] = this.props.style[key]
      }
    }

    let backdropStyle = {
      position: 'absolute',
      width: '100%',
      height: '100%',
      top: '0px',
      left: '0px',
      zIndex: '9998',
      background: 'rgba(0, 0, 0, 0.3)'
    }

    if (this.props.backdropStyle) {
      for (let key in this.props.backdropStyle) {
        backdropStyle[key] = this.props.backdropStyle[key]
      }
    }

    return (<div className={this.props.containerClassName}>
      <div className={this.props.className} style={modalStyle}>
        {this.props.children}
      </div>
      {!this.props.noBackdrop && <div className={this.props.backdropClassName} style={backdropStyle} onClick={e => this.close(e)}/>}
    </div>)
  }

  close(e) {
    e.preventDefault()

    if (this.props.onClose) {
      this.props.onClose()
    }
  }
}

export default ModalDialog;
