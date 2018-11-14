import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import validator from 'validator';
import * as actions from '../../redux/actions';
import Spinner from '../animates/spinner';

class Computer extends PureComponent {
  componentWillMount () {
    this.user = {
      name: {
        type: null,
        value: null
      },
      pass: null,
      secure: false
    }
    this.timer = null;
  }
  

  onSubmit = (e) => {
    e.preventDefault();
    if (this.props.user.loggingAction) return;
    console.log(this.user);
    if (this.user.pass && this.user.name.type) {
      console.log(this.user.pass, this.user.name.type, 'all good'); 
      this.props.user_login(this.user.name.value, this.user.pass);
    }
  }

  toggle_secure = (e) => {
    this.user.secure = this.refs.secure.checked;
  }

  get_name = () => {
    clearTimeout(this.timer);
    this.refs.name_warning.innerHTML = '';
    this.user.name.value = this.refs.name.value;
    this.timer = setTimeout(this.check_name, 1000);
  }

  check_name = () => {
    if (validator.isEmail(this.refs.name.value)) {
      this.user.name.type = 'email';
    }else if (validator.isMobilePhone(this.refs.name.value, ['zh-CN'])) {
      this.user.name.type = 'phone';
    }else {
      this.user.name.type = null;
      this.user.name.value = null;
      this.refs.name_warning.innerHTML = '格式错误';
      return;
    }
    this.refs.name_warning.innerHTML = '';
    this.user.name.value = this.refs.name.value;
  }

  get_pass = () => {
    if (this.refs.pass.value === '') {
      this.user.pass = null;
      this.refs.pass_warning.innerHTML = '必须输入密码';
    }else {
      this.refs.pass_warning.innerHTML = '';
      this.user.pass = this.refs.pass.value;
    }
  }
  render () {
    return (
      <form onSubmit={this.onSubmit}>
        <label>手机号码/电子邮箱<span ref="name_warning"></span></label>
        <input type="text" ref="name" autoComplete="off" placeholder="Phone/Email" onChange={this.get_name} />
        <label>密码<span ref="pass_warning"></span></label>
        <input type="password" ref="pass" placeholder="Password" onChange={this.get_pass}/>
        <div className="form-utils noselect">               
          <label><input type="checkbox" ref="secure" onChange={this.toggle_secure}/><span>信任此设备</span></label>
          <Link to="/forget">忘记密码</Link>
          <Link to="/register">没有账号？</Link>
        </div>
        <button>
        {this.props.user.loggingAction ? 
          <Spinner size="12px" single={false}/> : 
          '登陆'
        }
        </button>
      </form>
    )
  }
}

export default connect(({user}) => ({user}), actions)(Computer)