import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../../redux/actions';
import Button from '../../../components/forms/button';
import Input from '../../../components/forms/input';
import Spinner from '../../../components/animates/spinner';
import Upload from '../../../components/upload';
import errorText from '../../../helper/errorText';
import Security from '../../../components/security';
import word from '../../../helper/wordcounter';
import prefix from '../../../helper/prefix';
import validator from 'validator';
import cuid from 'cuid';


class Person extends PureComponent {
  constructor (props) {
    super(props);
    this.show = false;
    this.info = {
      name: null,
      phone: null,
      code: null,
      no: null,
      uploaded: 0
    }
    this.nick = this.props.user.user.username;
    if (this.props.page.setupPage !== 'person') this.props.current_setup_page('person');
  }
 
  componentWillUnmount () {
    this.props.change_setup_option(null);
  }

  expend = () => {
    this.show = true;
    this.forceUpdate();
  }
  close = () => {
    this.show = false;
    this.forceUpdate();
  }

  renderText = () => {
    if (this.props.user.loading) return '';
    switch (this.props.user.user.verification.verified) {
      case 1:
        return <p><span className="yellow">认证中...</span></p>;
      case 2:
        return <p><span className="green">已认证</span></p>;
      default:
        return <Button onClick={this.expend} text="我要认证" />;
    }
  }

  setName = (v) => {
    if (v.length < 1 || v.length > 10) {
      this.info.name = null;
    } else {
      this.info.name = v;
    }
  }

  verifyPhone = (v) => {
    this.info.phone = v;
    if (validator.isMobilePhone(v, ['zh-CN'])) {
      this.verify = true;
    } else {
      this.verify = false;
      this.info.phone = null;
    }
    this.forceUpdate();
  }

  setId = (v) => {
    if (v.length !== 18) {
      this.info.no = null;
    } else {
      this.info.no = v;
    }
  }

  change = () => {
    this.info.uploaded++;
  }

  submit = async () => {
    if (this.info.name === null || this.info.phone === null || this.info.no === null || !this.info.code) {
      return this.props.notification_in(errorText.fullInfo);
    }
    if (this.info.uploaded < 2) return this.props.notification_in(errorText.idPhoto);
    try {
      await this.props.send_identity(this.info);
      this.props.notification_in(errorText.submit2);
      this.show = false;
      this.forceUpdate();
    }catch(e) {
      this.props.notification_in(e);
    }
    
  }

  getCode = (code) => {
    if (this.info.code === code) return; 
    this.info.code = code;
  }

  changeName = () => {
    this.props.change_setup_option('name');
  }

  confirmName = async (v) => {
    const len = word(this.nick, true, true);
    if (this.nick === this.props.user.user.username) {
      this.props.change_setup_option(null);
    } else if (this.nick !== '' && !this.nick.match(/[^\w^\u4e00-\u9fa5^'^\s]+/g) && len<=20) {
      this.props.change_setup_option(null);
      try {
        await this.props.set_username(this.nick, this.props.user.user.UID);
      }catch(e) {
        this.props.notification_in(e);
      }
    } else {
      this.props.notification_in(errorText.text1);
    }
  }

  render () {
    return (
      <div>
        <div>
          <h3>头像</h3>
          <Upload className="pt" id="icon" round={true} color="#666699" onChange={this.change} width={80} height={80} crop={true} image={prefix(this.props.user.user.pic)} type='tn'>+</Upload>
        </div>
        <div>
          <h3>用户名</h3>
          {this.props.page.changeSetup !== 'name'?
            <div>
              <label ref="name">{this.props.user.user.username}</label>
              <Button text="修改" onClick={this.changeName}/>
            </div>:
            <div>
              <Input type="text" defaultValue={this.props.user.user.username} onBlur={(v) => this.nick = v} width="260px"/>
              <Button onClick={this.confirmName} width="128"/>
              <Button onClick={this.props.change_setup_option} text="取消" width="128"/>
            </div>
          }
        </div>
        <div>
          <h3>等级和经验值</h3>
          <p>
            <label>等级</label><span>Lv.{this.props.user.user.person.level}</span>
          </p>
          <p>
            <label>经验</label><span>{this.props.user.user.person.exp+'/1000'}</span>
          </p>
        </div>
        <div>
          <h3>实名认证</h3>
          {this.renderText()} 
        </div>
        {!this.show ?"": 
          <div>
            <h3>提交资料</h3>
            <div>
              <Input type="text" ref="name" placeholder="姓名" onBlur={this.setName} width="300px"
              condition={(v) => v.length > 1 && v.length <= 10}
              errorText={errorText.name}/>
              <Input type="number" ref="phone" placeholder="手机号码" onBlur={this.verifyPhone} width="300px"
              condition={(v) => validator.isMobilePhone(v, ['zh-CN'])}
              errorText={errorText.phone}/>
              {this.verify? <Security type='phone' value={this.info.phone} onChange={this.getCode} /> : ''}
              <Input type="text" ref="id" placeholder="身份证号码" onBlur={this.setId} width="300px"
              condition={(v) => v.length === 18}
              errorText={errorText.idno}/>
              <Upload className="idSide" id="idup" onChange={this.change} color="#666699" opt={false} crop={false} type='id-a'>身份证正面</Upload>
              <Upload className="idSide" id="iddown" onChange={this.change} color="#666699" opt={false} crop={false} type='id-b'>身份证反面</Upload>
              {this.props.user.submitting? <Spinner />:
              (
                <div>
                  <Button onClick={this.submit} text="提交" width="148"/>
                  <Button onClick={this.close} text="取消" width="148"/>
                </div>
              )
            }
            </div>
          </div>
        }  
      </div>
    )
  }
}

export default connect(({page, user}) => ({page, user}), actions)(Person);