import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import validator from 'validator';
import * as actions from '../../redux/actions';
import Spinner from '../animates/spinner';
import Input from '../forms/input';
import Check from '../forms/checkbox';
import Button from '../forms/save';
import errmsg from '../../helper/errorText';

class Computer extends PureComponent {
  constructor (props) {
    super(props);
    this.user = {
      name: {
        type: null,
        value: null
      },
      pass: null,
      secure: false
    }
    this.error = false; // false|[1,2,3]
    this.errText = errmsg.login;
  }
  

  onSubmit = async (e) => {
    e.preventDefault();
    if (this.props.user.loggingAction) return console.warn('login in action!');
    if (this.user.pass && this.user.name.type) {
      const res = await this.props.user_login(this.user.name.value, this.user.pass);
      if (res) {
        if (res === 3) this.errText = errmsg.login1;
        console.log('password wrong type: ', res);
        this.refresh(res);
      }
    } else this.refresh(true);
  }

  refresh = (v) => {
    this.error = v;
    this.forceUpdate()
  }

  toggle_secure = (e) => {
    this.user.secure = e[0].c;
  }

  get_name = (v) => {
    this.user.name.value = v;
    this.check_name(v);
    if (this.error) this.refresh(false);
    
  }
  get_pass = (v) => {
    this.user.pass = v;
    if (this.error) this.refresh(false);
  }

  check_name = (v) => {
    if (validator.isEmail(v)) {
      this.user.name.type = 'email';
    }else if (validator.isMobilePhone(v, ['zh-CN'])) {
      this.user.name.type = 'phone';
    }else {
      this.user.name.type = null;
      this.user.name.value = null;
      return;
    }
  }

  

  render () {
    return (
      <form onSubmit={this.onSubmit}>
        <Input type="text" label="手机/邮箱" placeholder="Phone/Email" onChange={this.get_name} />
        <Input type="password" label="密码" placeholder="Password" onChange={this.get_pass} 
        errorText={errmsg.login} strictError={this.error}/>
        <div className="form-utils noselect">               
          <Check options='信任此设备' onChange={this.toggle_secure} />
          <Link to="/forget">忘记密码</Link>
          <Link to="/register">没有账号？</Link>
        </div>
        <Button text={this.props.user.loggingAction? <Spinner size="12px" single={false}/> :'登录'}/>
      </form>
    )
  }
}

export default connect(({user}) => ({user}), actions)(Computer)