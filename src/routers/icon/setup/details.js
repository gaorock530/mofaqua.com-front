import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../../redux/actions';
import cuid from 'cuid';
import Input from '../../../components/forms/input';
import Button from '../../../components/forms/button';
import utils from '../../../helper/utils';
import errmsg from '../../../helper/errorText';

class Details extends PureComponent {
  constructor (props) {
    super(props);
    this.wrongPass = false;
    if (this.props.page.setupPage !== 'details') this.props.current_setup_page('details');
  }
  componentWillUnmount () {
    this.props.change_setup_option(null);
  }
  // handle password change event
  renderPass = () => {
    const submit = () => {
      this.wrongPass = !this.wrongPass;
      this.forceUpdate()
      // if (this.oldpass && this.pass) {
      //   console.log('ok');
      //   this.props.change_setup_option(null);
      //   this.props.notification_in(errmsg.updPass);
      //   this.oldpass = this.pass = '';
      // }
    }

    const cancel = () => {
      this.wrongPass = false;
      this.forceUpdate()
      this.props.change_setup_option(null);
    }
    
    return  this.props.page.changeSetup === 'password' ? (
      <div>
        <Input type="password" placeholder="原密码" width="300px" onBlur={(v, op, pass) => this.oldpass = pass? v: null }
        strictError={this.wrongPass} errorText={errmsg.pass2} />
        <Input type="password" placeholder="新密码" width="300px" onBlur={(v, op, pass) => this.pass = pass? v: null}
        condition={(v) => utils.checkPass(v)} errorText={errmsg.pass1} tag={{icon:'eye-slash', toggle:'eye'}} />
        <Button onClick={submit} text="提交"/>
        <Button onClick={cancel} text="取消"/>
      </div>
    ) : '';
  }
  // handle phone change event
  renderPhone = () => {
    const submit = () => {
      if (this.refs.oldpass.value !== '' && this.refs.pass.value !== '' && this.refs.pass.value === this.refs.repass.value ) {
        this.props.change_setup_option(null);
        this.props.notification_in(cuid(), errmsg.updPhone);
      }
    }
    
    return this.props.page.changeSetup === 'phone' ? (
      <div>
        {/* <p>密码错误</p> */}
        <p><input type="number" placeholder="验证码" ref="phonecode"/></p>
        <a onClick={submit}>提交</a>
      </div>
    ) : '';
  }
  // handle email change event
  renderEmail = () => {
    const submit = () => {
      if (this.refs.oldpass.value !== '' && this.refs.pass.value !== '' && this.refs.pass.value === this.refs.repass.value ) {
        this.props.change_setup_option(null);
        this.props.notification_in(cuid(), errmsg.updEmail);
      }
    }
    
    return  this.props.page.changeSetup === 'email' ? (
      <div>
        {/* <p>密码错误</p> */}
        <p><input type="number" placeholder="验证码" ref="emailcode"/></p>
        <a onClick={submit}>提交</a>
      </div>
    ) : '';
  } 

  render () {
    const changePass = () => {
      this.props.change_setup_option('password');
    }
    const changePhone = () => {
      this.props.notification_in(cuid(), errmsg.code1);
      this.props.change_setup_option('phone');
    }
    const changeEmail = () => {
      this.props.notification_in(cuid(), errmsg.code2);
      this.props.change_setup_option('email');
    }
    const {email, phone, secure} = this.props.user.user;
    const secureText = utils.passLevel(secure);
    return (
      
      <div>
        <div>
          <h3>密码设置</h3>
          <p>
            <label>安全等级: <b className={secureText.c}>{secureText.a}</b></label>
            {this.props.page.changeSetup !== 'password'?<Button onClick={changePass} text="变更"/>: ''}
          </p> 
          {this.renderPass()}
        </div>
        <div>
          <h3>已绑定邮箱</h3>
          <p>
            <label>{email || '无'}</label>
            {this.props.page.changeSetup !== 'email'?<Button onClick={changeEmail} text={email?"变更":"绑定"}/>: ''}
          </p>
          {this.renderEmail()}
        </div>
        <div>
          <h3>已绑定手机</h3>
          <p>
            <label>{phone || '无'}</label>
            {this.props.page.changeSetup !== 'phone'?<Button onClick={changePhone} text={phone?"变更":"绑定"}/>: ''}
          </p>
          {this.renderPhone()}
        </div>
        <div>
          <h3>版权状态</h3>
          <p>
            <label style={{color: 'green'}}>正常</label>
            <a>详情</a>
          </p>
          <p>您没有收到版权警示。</p>
        </div>
        <div>
          <h3>行为准则状态</h3>
          <p>
            <label style={{color: 'yellow'}}>一般</label>
            <a>详情</a>
          </p>
          <p>您没有收到社区准则警示。</p>
        </div>
      </div>
    )
  }
}

export default connect(({user, page}) => ({user, page}), actions)(Details);