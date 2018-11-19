import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../../redux/actions';
import Input from '../../../components/forms/input';
import Button from '../../../components/forms/button';
import Security from '../../../components/security';
import utils from '../../../helper/utils';
import errmsg from '../../../helper/errorText';
import validator from 'validator';

class Details extends PureComponent {
  constructor (props) {
    super(props);
    this.wrongPass = false;
    this.oldPhone = {value: '', valid: false, pass: false};
    this.newPhone = {value: '', valid: false};
    this.oldEmail = {value: '', valid: false, pass: false};
    this.newEmail = {value: '', valid: false};
    if (this.props.page.setupPage !== 'details') this.props.current_setup_page('details');
  }

  // handle password change event
  renderPass = () => {
    const submit = async () => {
      if (!this.oldpass || !this.pass || this.oldpass.length < 8 || !utils.checkPass(this.pass)) return;
      const res = await this.props.update_pass(this.oldpass, this.pass);
      if (!res) {
        this.props.change_setup_option();
        this.props.notification_in(errmsg.pass3);
      } else {
        this.wrongPass = true;
        this.forceUpdate()
      }
    }
    const onChangepass = (v) => {
      if (this.wrongPass) {
        this.wrongPass = false;
        this.forceUpdate();
      }
      this.oldpass = v;
    }
    return  this.props.page.changeSetup === 'password' ? (
      <div>
        <Input type="password" placeholder="原密码" width="300px" onChange={onChangepass}
        strictError={this.wrongPass} errorText={errmsg.pass2} />
        <Input type="password" placeholder="新密码" width="300px" onChange={(v) => this.pass = v} //this.pass = pass? v: null
        condition={(v) => utils.checkPass(v)} errorText={errmsg.pass1} tag={{icon:'eye-slash', toggle:'eye'}} />
        <Button onClick={submit} text="提交"/>
        <Button onClick={this.props.change_setup_option} text="取消"/>
      </div>
    ) : '';
  }

  cancel = () => {
    this.oldPhone = {value: '', valid: false, pass: false};
    this.newPhone = {value: '', valid: false};
    this.oldEmail = {value: '', valid: false, pass: false};
    this.newEmail = {value: '', valid: false};
    this.code = '';
    this.props.change_setup_option();
  }
  // handle phone change event
  renderPhone = () => {
    const validOld = !(Boolean(this.props.user.user.phone) ^ this.oldPhone.pass);
    const onChangeOld = (v, op, valid) => {
      this.oldPhone.value = v;
      if (this.newPhone.valid || this.oldPhone.pass) {
        this.oldPhone.pass = false;
        this.newPhone.valid = false;
      }
      if (this.oldPhone.valid === valid) return;
      this.oldPhone.valid = valid;
      this.forceUpdate();
    }
    const onChangeNew = async (v, op, valid) => { 
      this.newPhone.value = v;
      if (this.newPhone.valid === valid) return;
      //checking phone format
      this.newPhone.valid = valid;
      // check is phone number is taken
      if (valid) {
        if (this.oldPhone.value === this.newPhone.value) return this.props.notification_in(errmsg.phone1);
        const res = await this.props.phone_verify(v);
        if (res) {
          this.props.notification_in(errmsg.phone1);
          this.newPhone.valid = false;
        }
      }
      this.forceUpdate();
    }
    const submit = async () => {
      if (this.props.user.user.phone && this.oldPhone.valid) {
        const res = await this.props.validatePE(this.oldPhone.value, this.code);
        if (res) return this.props.notification_in(res);
        this.oldPhone.pass = true;
        this.oldPhone.value = '';
        this.oldPhone.valid = false;
        this.code = '';
        this.forceUpdate()
      }
      
      if (validOld && this.newPhone.valid && this.code.length === 6) {
        const res = await this.props.updatePE(this.newPhone.value, this.code);
        if (res) return this.props.notification_in(res);
        this.cancel();
        this.props.notification_in(errmsg.updPhone);
      }
    }
    
    return this.props.page.changeSetup === 'phone' ? (
      <div>
        {this.props.user.user.phone?<Input type="number" placeholder="原手机号码" width="300px"
        onChange={onChangeOld} condition={(v) => validator.isMobilePhone(v, ['zh-CN'])} errorText={errmsg.phone}/>:''}
        {validOld?<Input type="number" placeholder="新手机号码" width="300px" onChange={onChangeNew}
        condition={(v) => validator.isMobilePhone(v, ['zh-CN'])} errorText={errmsg.phone}/>:''}
        {this.oldPhone.valid || this.newPhone.valid? <Security type='phone' value={this.oldPhone.value || this.newPhone.value} onChange={v => this.code = v}/>:''}
        <Button onClick={submit} text="提交"/>
        <Button onClick={this.cancel} text="取消"/>
      </div>
    ) : '';
  }

  // handle email change event
  renderEmail = () => {
    const validOld = !(Boolean(this.props.user.user.email) ^ this.oldEmail.pass);
    const onChangeOld = (v, op, valid) => {
      this.oldEmail.value = v;
      if (this.newEmail.valid || this.oldEmail.pass) {
        this.oldEmail.pass = false;
        this.newEmail.valid = false;
      }
      if (this.oldEmail.valid === valid) return;
      this.oldEmail.valid = valid;
      this.forceUpdate();
    }

    const onChangeNew = async (v, op, valid) => {
      this.newEmail.value = v;
      if (this.newEmail.valid === valid) return;
      //checking phone format
      this.newEmail.valid = valid;
      // check is phone number is taken
      if (valid) {
        console.log('email pass');
        if (this.oldEmail.value === this.newEmail.value) return this.props.notification_in(errmsg.email1);
        const res = await this.props.email_verify(v);
        if (res) {
          this.props.notification_in(errmsg.email1);
          this.newEmail.valid = false;
        }
      }
      this.forceUpdate();
    }
    const submit = async () => {
      if (this.props.user.user.email && this.oldEmail.valid) {
        const res = await this.props.validatePE(this.oldEmail.value, this.code);
        if (res) return this.props.notification_in(res);
        this.oldEmail.pass = true;
        this.oldEmail.value = '';
        this.code = '';
        this.oldEmail.valid = false;
        this.forceUpdate()
      }

      if (validOld && this.newEmail.valid && this.code.length === 6) {
        const res = await this.props.updatePE(this.newEmail.value, this.code);
        if (res) return this.props.notification_in(res);
        this.cancel();
        this.props.notification_in(errmsg.updEmail);
      }
    }
    
    return  this.props.page.changeSetup === 'email' ? (
      <div>
        {this.props.user.user.email?<Input type="email" placeholder="原邮箱地址" width="300px"
        onChange={onChangeOld} condition={(v) => validator.isEmail(v)} errorText={errmsg.email}/>:''}
        {validOld?<Input type="email" placeholder="新邮箱地址" width="300px" onChange={onChangeNew}
        condition={(v) => validator.isEmail(v)} errorText={errmsg.email}/>:''}
        {this.oldEmail.valid || this.newEmail.valid? <Security type='email' value={this.oldEmail.value || this.newEmail.value} onChange={v => this.code = v}/>:''}
        <Button onClick={submit} text="提交"/>
        <Button onClick={this.cancel} text="取消"/>
      </div>
    ) : '';
  } 

  render () {
    const {email, phone, secure} = this.props.user.user;
    const secureText = utils.passLevel(secure);
    return (
      
      <div>
        <div>
          <h3>密码设置</h3>
          <p>
            <label>安全等级: <b className={secureText.c}>{secureText.a}</b></label>
            {this.props.page.changeSetup !== 'password'?<Button onClick={this.props.change_setup_option.bind(this, 'password')} text="变更"/>: ''}
          </p> 
          {this.renderPass()}
        </div>
        <div>
          <h3>已绑定邮箱</h3>
          <p>
            <label>{email || '无'}</label>
            {this.props.page.changeSetup !== 'email'?<Button onClick={this.props.change_setup_option.bind(this, 'email')} text={email?"变更":"绑定"}/>: ''}
          </p>
          {this.renderEmail()}
        </div>
        <div>
          <h3>已绑定手机</h3>
          <p>
            <label>{this.props.user.user.phone || '无'}</label>
            {this.props.page.changeSetup !== 'phone'?<Button onClick={this.props.change_setup_option.bind(this, 'phone')} text={phone?"变更":"绑定"}/>: ''}
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