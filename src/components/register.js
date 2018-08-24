import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';

import validator from 'validator';
import * as actions from '../redux/actions';
import Spinner from './animates/spinner';
import word from '../helper/wordcounter';
const cuid = require('cuid');

class Register extends Component {
  componentWillMount () {
    this.user = {
      pass: null,
      name: {
        type: null,
        value: null
      },
      nick: null,
      code: null
    }
    this.timer = null;
  }

  componentWillUnmount () {
    clearInterval(this.counter);
    this.props.abort_verify();
    this.timer = null;
  }

  checkName = () => {
    clearTimeout(this.timer);
    if (this.props.user.vaildPhoneFormat) this.props.phone_verify(false);
    if (this.props.user.vaildEmailFormat) this.props.email_verify(false);
    this.user.name.value = this.refs.name.value;
    this.refs.name_warning.innerHTML = '';
    this.timer = setTimeout(this.handleName, 1000);
  }

  

  handleName = async () => {
    if (validator.isMobilePhone(this.refs.name.value, ['zh-CN']) && this.props.page.registerForm) {
      this.user.name.type = 'phone';
      this.user.name.value = this.refs.name.value;
      this.refs.name_warning.innerHTML = '';
      await this.props.phone_verify(this.refs.name.value);
    } else if (validator.isEmail(this.refs.name.value) && !this.props.page.registerForm) {
      this.user.name.type = 'email';
      this.user.name.value = this.refs.name.value;
      this.refs.name_warning.innerHTML = '';
      await this.props.email_verify(this.refs.name.value);
    } else {
      this.refs.name_warning.innerHTML = this.props.page.registerForm? '手机号码格式错误':'电子邮箱格式错误'; 
      this.user.name.type = null;
      this.user.name.value = null;
      await this.props.phone_verify(false);
      await this.props.email_verify(false);
    }
  }

  handleRepass = () => {
    if (this.refs.repass.value === this.refs.pass.value && this.refs.pass.value !== '') {
      this.user.pass = this.refs.repass.value;
      this.refs.repass_warning.innerHTML = '';
    }else {
      this.refs.repass_warning.innerHTML = '密码不一致';
      this.user.pass = null;
    }
  }

  onSubmit = async (e) => {
    e.preventDefault();
    if (this.props.user.loggingAction) return;
    console.log(this.user);
    if (this.user.pass && this.user.name.type && this.user.code && this.user.nick) {
      console.log('all good');
      try {
        await this.props.register(this.user);
      }catch(e) {
        console.log(e);
        this.props.notification_in(cuid(), e);
      }
    } 
  }

  onBlur = (e) => {
    this.user.code = e.target.value;
  }

  phone = () => {
    const sendSMS = () => {
      // if phone number fromat is not valid, disable click
      if (!this.props.user.vaildPhoneFormat) return;
      // if count down is running, disable click
      if (this.props.user.phoneResendin !== 0) return;
      // set re-send time
      let time = 120;
      this.props.send_text_code(this.user.name.value);
      // send notification
      this.props.phone_resendin(time);
      this.counter = setInterval(() => {
        time--;
        this.props.phone_resendin(time);
        if (time === 0) clearInterval(this.counter);
      },1000);
    }
    
    return this.props.user.vaildPhoneFormat ? (
      <div className="phone-verify">
        <div>
          {this.props.user.phoneResendin === 0 ? 
          <a onClick={sendSMS}>发送验证码</a>: 
          <a className="sending">{this.props.user.phoneResendin}s 后重新发送</a>}
        </div>
        <div>
          <input type="number" placeholder="验证码" onBlur={this.onBlur}/>
        </div>
      </div>
    ) : '';
  }
  email = () => {
    const sendEmail = () => {
      // if phone number fromat is not valid, disable click
      if (!this.props.user.vaildEmailFormat) return;
      // if count down is running, disable click
      if (this.props.user.emailResendin !== 0) return;
      // set re-send time
      let time = 120;
      // send notification
      this.props.send_email_code(this.user.name.value);
      this.props.email_resendin(time);
      this.counter = setInterval(() => {
        time--;
        this.props.email_resendin(time);
        if (time === 0) clearInterval(this.counter);
      },1000);
    }
    return this.props.user.vaildEmailFormat ? (
      <div className="phone-verify">
        <div>
          {this.props.user.emailResendin === 0 ? 
          <a onClick={sendEmail}>发送邮件验证码</a>: 
          <a className="sending">{this.props.user.emailResendin}s 后重新发送</a>}
        </div>
        <div>
          <input type="number" placeholder="验证码" onBlur={this.onBlur}/>
        </div>
      </div>
    ) : '';
  }

  checkNick = () => {
    const warn = this.refs.nick_warning;
    clearTimeout(this.nickTimer);
    this.user.nick = null;
    warn.innerHTML = '';
    this.nickTimer = setTimeout(async () => {
      const nick = this.refs.nick.value.trim();
      if (nick.match(/[^\w^\u4e00-\u9fa5^'^\s]+/g)) return warn.innerHTML = `昵称不符合规范`;
      const len = word(nick, true, true);
      if (len>20) {
        console.log(this.user);
        return warn.innerHTML = `昵称不符合规范`;
      }
      try {
        await this.props.name_verify(nick);
        this.user.nick = nick;
      }catch(e) {
        this.props.notification_in(cuid(), e);
      }
      console.log(this.user);
      return warn.innerHTML = `len: ${len}`;
    }, 1000);
  }

  Form = () => {
    return (
      <form onSubmit={this.onSubmit}>
        <label>{this.props.page.registerForm?'手机号码':'电子邮箱'}<span ref="name_warning"></span></label>
        {this.props.page.registerForm?
          <input type="number" ref="name" autoComplete="off" placeholder="Phone number" onChange={this.checkName} />:
          <input type="email" ref="name" autoComplete="off" placeholder="Email Address" onChange={this.checkName} />
        }
        {this.props.page.registerForm?this.phone(): this.email()}
        <label>昵称<span ref="nick_warning"></span></label>
        <input type="text" ref="nick" autoComplete="off" placeholder="10个汉字或20个字母数字" onChange={this.checkNick} />
        <label>密码<span ref="pass_warning"></span></label>
        <input type="password" ref="pass" placeholder="Password" onChange={this.handleRepass}/>
        <label>确认密码<span ref="repass_warning"></span></label>
        <input type="password" ref="repass" placeholder="Re-Password" onChange={this.handleRepass}/>
        <label className="gotoLogin"><Link to="/login">已经注册？</Link></label>
        <button>{this.props.user.loggingAction ? 
          <Spinner size="12px" single={false}/> : 
          '注册'
        }</button>
      </form>
    )
  }

  toogle_form = (value) => {
    if (value === this.props.page.registerForm) return;
    this.props.set_register(value);
    this.props.abort_verify();
    clearInterval(this.counter);
    this.refs.name_warning.innerHTML = '';
    this.refs.name.value = '';
    this.refs.pass.value = '';
    this.refs.repass.value = '';
  }

  render () {
    const { from } = this.props.location.state || { from: { pathname: "/" } };
    const { isLogin } = this.props.user;

    if (isLogin) {
      this.onLogin = false;
      return <Redirect to={from} />;
    } 

    return (
      <div>
        <section className="header-mask"></section> 
        <section className="login-page">
          <div className="form-nav">
            <nav onClick={this.toogle_form.bind(this, true)} className={this.props.page.registerForm?'formactive': ''}>手机注册</nav>
            <nav onClick={this.toogle_form.bind(this, false)} className={this.props.page.registerForm?'': 'formactive'}>邮箱注册</nav>
          </div>
          {this.Form()}
        </section>
      </div>
    )
  }
}

export default connect(state => state, actions)(Register);