import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../../redux/actions';
import cuid from 'cuid';

class Details extends Component {
  componentWillUnmount () {
    this.props.change_setup_option(null);
  }
  // handle password change event
  renderPass = () => {
    const submit = () => {
      console.log('asd');
      if (this.refs.oldpass.value !== '' && this.refs.pass.value !== '' && this.refs.pass.value === this.refs.repass.value ) {
        console.log('ok');
        this.props.change_setup_option(null);
        this.props.notification_in(cuid(), '密码已更新');
      }
    }
    
    return  this.props.page.changeSetup === 'password' ? (
      <div>
        {/* <p>密码错误</p> */}
        <p><input type="password" placeholder="原密码" ref="oldpass"/></p>
        <p><input type="password" placeholder="新密码" ref="pass"/></p>
        <p><input type="password" placeholder="重复新密码" ref="repass"/></p>
        <a onClick={submit}>提交</a>
      </div>
    ) : '';
  }
  // handle phone change event
  renderPhone = () => {
    const submit = () => {
      if (this.refs.oldpass.value !== '' && this.refs.pass.value !== '' && this.refs.pass.value === this.refs.repass.value ) {
        this.props.change_setup_option(null);
        this.props.notification_in(cuid(), '手机号码已更新');
      }
    }
    
    return  this.props.page.changeSetup === 'phone' ? (
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
        this.props.notification_in(cuid(), '邮箱地址已更新');
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
      this.props.notification_in(cuid(), '手机验证码已发送，请查收');
      this.props.change_setup_option('phone');
    }
    const changeEmail = () => {
      this.props.notification_in(cuid(), '邮箱验证码已发送，请查收');
      this.props.change_setup_option('email');
    }

    return (
      <div>
        <div>
          <h3>密码设置</h3>
          <span>
            <label>安全等级: 高</label>
            {this.props.page.changeSetup !== 'password'?<a onClick={changePass}>变更</a>: ''}
          </span>
          {this.renderPass()}
        </div>
        <div>
          <h3>已绑定邮箱</h3>
          <span>
            <label>gaorock530@hotmail.com</label>
            {this.props.page.changeSetup !== 'email'?<a onClick={changeEmail}>变更</a>: ''}
          </span>
          {this.renderEmail()}
        </div>
        <div>
          <h3>已绑定手机</h3>
          <span>
            <label>13681221170</label>
            {this.props.page.changeSetup !== 'phone'?<a onClick={changePhone}>变更</a>: ''}
          </span>
          {this.renderPhone()}
        </div>
        <div>
          <h3>版权状态</h3>
          <span>
            <label style={{color: 'green'}}>正常</label>
            <a>详情</a>
          </span>
          <p>您没有收到版权警示。</p>
        </div>
        <div>
          <h3>行为准则状态</h3>
          <span>
            <label style={{color: 'yellow'}}>一般</label>
            <a>详情</a>
          </span>
          <p>您没有收到社区准则警示。</p>
        </div>
      </div>
    )
  }
}

export default connect(state => state, actions)(Details);