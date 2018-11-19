import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';

import validator from 'validator';
import * as actions from '../redux/actions';
import Spinner from './animates/spinner';
import Input from './forms/input';
import Save from './forms/save';
import Security from './security';
import utils from '../helper/utils';
import errmsg from '../helper/errorText';


class Register extends Component {
  constructor (props) {
    super (props);
    this.user = {
      pass: '',
      name: {
        type: 'phone',
        value: ''
      },
      nick: '',
      code: ''
    }
    this.valid = {
      pass: false,
      name: false,
      nick: false,
      code: false
    }
    this.nav = true;
    this.sending = false;
    this.error = errmsg.format;
  }

  checkName = async (v) => {
    this.valid.name = false;
    if ((this.nav && validator.isMobilePhone(v, ['zh-CN'])) || (!this.nav && validator.isEmail(v))) {
      const res = this.nav?await this.props.phone_verify(v):await this.props.email_verify(v);
      if (!res) {
        this.valid.name = true;
        this.forceUpdate();
        return true;
      }
    } 
    this.forceUpdate();
    return false;
  }

  checkNick = async (v) => {
    this.valid.nick = false;
    const nick = utils.checkNick(v);
    if (!nick) {
      return false;
    }
    const res = await this.props.name_verify(nick);
    if (!res) {
      this.valid.nick = true;
      return true;
    }
    return false;
  }

  checkPass = (v) => {
    this.valid.pass = false;
    const res = utils.checkPass(v);
    if (res) {
      this.valid.pass = true;
      return true;
    }
    return false;
  }

  checkCode = (v) => {
    this.user.code = v;
    if (v.length === 6) return this.valid.code = true;
    this.valid.code = false;
  }


  onSubmit = async (e) => {
    e.preventDefault();
    if (this.props.user.loggingAction) return;
    console.log(this.valid);
    console.log(this.user);
    if (this.valid.code && this.valid.nick && this.valid.pass && this.valid.name) {
      try {
        await this.props.register(this.user);
      }catch(e) {
        this.props.notification_in(e);
      }
    } 
  }  

  onNameChange = (v) => {
    v = v.target? v.target.value : v;
    if (this.user.name.value !== v) {
      this.valid.name = false;
      this.user.name.value = v;
    }
  }
  onNickChange = (v) => {
    v = v.target? v.target.value : v;
    if (this.user.nick !== v) {
      this.valid.nick = false;
      this.user.nick = v;
    }
  }
  onPassChange = (v) => {
    v = v.target? v.target.value : v;
    if (this.user.pass !== v) {
      this.valid.pass = false;
      this.user.pass = v;
    }
  }

  toogle_form = (v) => {
    if (this.nav === v) return;
    this.nav = !this.nav;
    this.valid.name = false;
    this.user.name.type = this.nav?'phone':'email';
    this.user.name.value = '';
    this.forceUpdate();
  }

  render () {
    const { from } = this.props.location.state || { from: { pathname: "/" } };
    const { isLogin } = this.props.user;

    if (isLogin) {
      return <Redirect to={from} />;
    } 

    return (
      <div>
        <section className="header-mask"></section> 
        <section className="login-page">
          <div className="form-nav">
            <nav onClick={this.toogle_form.bind(this, true)} className={this.nav?'formactive': ''}>手机注册</nav>
            <nav onClick={this.toogle_form.bind(this, false)} className={this.nav?'': 'formactive'}>邮箱注册</nav>
          </div>
          <form onSubmit={this.onSubmit}>
            <Input type={this.nav?"number":"email"} 
            label={this.nav?"手机号码":"电子邮箱"} 
            placeholder={this.nav?"Phone number":"Email Address"} 
            errorText={errmsg.format} 
            onChange={this.onNameChange} 
            condition={this.checkName}
            force={true}/>

            {this.valid.name ? <Security type={this.user.name.type} value={this.user.name.value} onChange={this.checkCode}/>:''}

            <Input type="text" label="昵称" placeholder="10个汉字或20个字母数字" 
            errorText={errmsg.name} 
            onChange={this.onNickChange} 
            condition={this.checkNick}/>

            <Input type="password" label="密码" placeholder="Password" 
            onBlur={(v, op, pass) => this.pass = pass? v: null}
            condition={(v) => this.checkPass(v)} 
            errorText={errmsg.pass1} 
            tag={{icon:'eye-slash', toggle:'eye'}} 
            onChange={this.onPassChange}/>

            <label className="form-utils"><div><Link to="/login">已经注册？</Link></div></label>
            <Save text={this.props.user.loggingAction ? <Spinner size="12px" single={false}/> : '注册'} />
          </form>
        </section>
      </div>
    )
  }
}

export default connect(({user})=> ({user}), actions)(Register);