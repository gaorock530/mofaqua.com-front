import React, { PureComponent } from 'react';
import cuid from 'cuid';
import * as actions from '../redux/actions';
import { connect } from 'react-redux';

class Security extends PureComponent {
  constructor (props) {
    super(props);
    if (!this.props.value) this.props.notification_in(cuid(), 'missing value to be sent.');
    this.value = this.props.value
  }

  sendSMS = () => {
    // if phone number fromat is not valid, disable click
    if (!this.props.value) this.props.notification_in(cuid(), 'missing value to be sent.');
    // if count down is running, disable click
    if (this.props.user.phoneResendin !== 0) return;
    // set re-send time
    let time = 120;
    this.props.notification_in(cuid(), '正在发送验证码...');
    this.props.send_text_code(this.props.value);
    // send notification
    this.props.phone_resendin(time);
    this.counter = setInterval(() => {
      time--;
      this.props.phone_resendin(time);
      if (time === 0) clearInterval(this.counter);
    },1000);
  }

  onBlur = (e) => {
    if (this.props.onBlur) this.props.onBlur(e.target.value);
  }

  render () {
    return (
      <div>
        <div>
          {this.props.user.phoneResendin === 0 ? 
          <a onClick={this.sendSMS}>发送验证码</a>: 
          <span>{this.props.user.phoneResendin}s 后重新发送</span>}
        </div>
        <div>
          <input type="number" placeholder="验证码" onBlur={this.onBlur}/>
        </div>
      </div>
    )
  }
}

const state = (state) => {
  return {user: state.user}
}

export default connect(state, actions)(Security);