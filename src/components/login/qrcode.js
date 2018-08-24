import React, { Component } from 'react';
import { connect } from 'react-redux';
// import { Link } from 'react-router-dom';
import { QRCode } from 'react-qr-svg';
import cuid from 'cuid';
import * as actions from '../../redux/actions';

class Qrcode extends Component {
  componentWillMount () {
    this.id = cuid();
    this.props.qrcode(true);
    this.timer = setTimeout(() => {
      console.log('过期了');
      this.props.qrcode(false);
    }, 1000*3);
  }

  componentWillUnmount () {
    this.props.qrcode(false);
    clearTimeout(this.timer);
  }
  render () {
    return (
      <div className="login-qcode">
        <QRCode
          bgColor="#eeeeee"
          fgColor="#000000"
          level="L"
          style={{ width: 300 }}
          value={this.id}
        />
      </div>
    )
  }
}

export default connect(state => state, actions)(Qrcode)

