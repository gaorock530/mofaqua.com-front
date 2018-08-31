import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../../redux/actions';
// import Error from '../../../components/error';
import style from '../../../helper/style';
import Upload from '../../../components/upload';
import Security from '../../../components/security';
import word from '../../../helper/wordcounter';
import prefix from '../../../helper/prefix';
import validator from 'validator';
import cuid from 'cuid';


class Person extends Component {
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
  }
 
  componentWillUnmount () {
    this.props.change_setup_option(null);
    // remove styles
    this.index.map((index) => style.del(index));
  }
  componentDidMount () {
    //only delete after added!
    this.add = false;
    // store new styles indexes in styleSheet
    this.index = [];
  }
  componentWillReceiveProps () {
    this.percent = Math.floor(Math.random()*10)*100;
  }

  expend = () => {
    this.show = true;
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
        return <p><a onClick={this.expend}>我要认证</a></p>;
    }
  }

  setName = () => {
    this.info.name = this.refs.name.value.trim() || null;
  }

  verifyPhone = () => {
    clearTimeout(this.timer);
    this.verify = false;
    this.forceUpdate();
    this.timer = setTimeout(() => {
      if (validator.isMobilePhone(this.refs.phone.value.toString(), ['zh-CN'])) {
        this.verify = true;
        this.info.phone = this.refs.phone.value;
      } else {
        this.verify = false;
        this.info.phone = null;
        this.props.notification_in(cuid(), '手机号码格式不正确，请重新输入');
      }
      this.forceUpdate();
    }, 1000);
  }

  setId = () => {
    this.info.no = this.refs.id.value || null;
  }

  change = () => {
    this.info.uploaded++;
  }

  submit = async () => {
    if (this.info.name === null || this.info.phone === null || this.info.no === null || this.info.code === null) {
      return this.props.notification_in(cuid(), '请完整填写所有信息');
    }
    if (this.info.uploaded < 2) return this.props.notification_in(cuid(), '请上传身份证正反两面');
    try {
      const res = await this.props.send_identity(this.info);
      if (!res) return this.props.notification_in(cuid(), '服务器出错，请稍后重试');
      this.props.notification_in(cuid(), '提交成功，系统将在48小时内完成认证');
    }catch(e) {
      console.log(e);
      return this.props.notification_in(cuid(), '服务器出错，请稍后重试');
    }
    this.show = false;
    this.forceUpdate();
  }

  getCode = (code) => {
    this.info.code = code;
  }

  changeName = () => {
    this.props.change_setup_option('name');
  }

  confirmName = () => {
    const name = this.refs.newName.value.trim();
    const len = word(name, true, true);
    if (name === this.props.user.user.username) {
      this.props.change_setup_option(null);
    } else if (name !== '' && !name.match(/[^\w^\u4e00-\u9fa5^'^\s]+/g) && len<=20) {
      this.props.change_setup_option(null);
      this.props.set_username(this.refs.newName.value, this.props.user.user.UID);
    } else {
      this.refs.newName.select();
      this.props.notification_in(cuid(), '不符合规则(20个字母或10个中文');
    }
  }

  onKeyDown = (e) => {
    if (e.keyCode === 13) {
      this.confirmName();
    }
  }

  render () {
    const buyer = this.props.user.user.buyer;
    return (
      <div>
        <div>
          <h3>头像</h3>
          <Upload className="pt" id="icon" round={true} color="#666699" onChange={this.change} width={80} height={80} crop={true} image={prefix(this.props.user.user.pic)} type='tn'>+</Upload>
        </div>
        <div>
          <h3>用户名</h3>
          {this.props.page.changeSetup !== 'name'?
            <p>
              <label ref="name">{this.props.user.user.username}</label>
              <a onClick={this.changeName}>修改</a>
            </p>:
            <p>
              <input type="text" ref="newName" defaultValue={this.props.user.user.username} onKeyDown={this.onKeyDown}/>
              <a onClick={this.props.change_setup_option}>取消</a>
              <a onClick={this.confirmName}>确定</a>
            </p>
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
          <h3>交易评估和等级</h3>
          <p>
            <label>等级</label><span>Lv.{buyer?buyer.level:''}</span>
          </p>
          <p>
            <label>经验</label><span>{buyer?buyer.exp+'/1000':''}</span>
          </p>
          <p>
            <label>信用值</label><span>{buyer?buyer.credit: ''}</span>
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
              <p><input type="text" ref="name" placeholder="姓名" onBlur={this.setName} /></p>
              <p><input type="number" ref="phone" placeholder="手机号码" onChange={this.verifyPhone}/></p>
              {this.verify? <Security value={this.info.phone} onBlur={this.getCode} /> : ''}
              <p><input type="text" ref="id" placeholder="身份证号码" onBlur={this.setId}/></p>
              <Upload className="idSide" id="idup" onChange={this.change} color="#666699" opt={false} crop={false} type='id-a'>身份证正面</Upload>
              <Upload className="idSide" id="iddown" onChange={this.change} color="#666699" opt={false} crop={false} type='id-b'>身份证反面</Upload>
              {this.props.user.submitting? '正在提交...':<button onClick={this.submit}>提交</button>}
            </div>
          </div>
        }  
      </div>
    )
  }
}
const state = (state) => {
  return {page: state.page, user: state.user}
}
export default connect(state, actions)(Person);