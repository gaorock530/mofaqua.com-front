import React, { PureComponent } from 'react';
import * as actions from '../redux/actions';
import { connect } from 'react-redux';
import Input from './forms/input';
import Button from './forms/button';

/**
 * @param {String} type phone/email
 * @param {String} value value to be sent to
 * @param {Function} onChange
 * @param {Function} onBlur
 */

class Security extends PureComponent {
  constructor (props) {
    super(props);
    if (!this.props.type) console.warn('missing type phone/email.');
    if (!this.props.value) console.warn('missing value to be sent.');
    this.value = this.props.value;
    this.sending = false;
  }

  componentWillUnmount () {
    this.props.phone_resendin(0);
    clearInterval(this.counter);
  }

  sendSMS = async () => {
    // preventing over clicking
    if (this.sending) return;
    // if phone number fromat is not valid, disable click
    if (!this.props.value) throw Error('missing value to be sent.');
    // if count down is running, disable click
    if (this.props.user.phoneResendin !== 0) return;
    // set re-send time
    let time = 120;
    this.sending = true;
    this.props.notification_in('正在发送验证码...');
    
    try {
      const res = await this.props.get_code(this.props.type, this.props.value);
      this.props.notification_in(res);
      // send notification
      
      this.counter = setInterval(() => {
        this.props.phone_resendin(--time);
        if (time === 0) clearInterval(this.counter);
      },1000);
    }catch(e) {
      this.props.notification_in(e);
    }
    this.sending = false;
  }

  onBlur = (v) => {
    if (this.props.onBlur) this.props.onBlur(v);
  }

  onChange = (v) => {
    if (this.props.onChange) this.props.onChange(v);
  }

  render () {
    return (
      <div className="security-wrapper">
        <div className="security-button">
          {this.props.user.phoneResendin === 0 ? 
          <Button onClick={this.sendSMS} text="发送验证码"/>: 
          <span>{this.props.user.phoneResendin}s 后重新发送</span>}
        </div>
        <div className="security-input">
          <Input type="number" placeholder="验证码" onChange={this.onChange} onBlur={this.onBlur} width="100%" 
          condition={(v) => v.length === 6} errorText="请输入6位验证码" />
        </div>
      </div>
    )
  }
}


export default connect(({user}) => ({user}), actions)(Security);