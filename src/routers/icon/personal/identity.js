import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../../redux/actions';
import Upload from '../../../components/upload';
import validator from 'validator';
import cuid from 'cuid';
import Security from '../../../components/security';
// import Radio from '../../../components/forms/radio';

class Identity extends PureComponent {
  constructor (props) {
    super(props);
    this.show = false;
    this.type = 0;
    this.info = {
      name: null,
      phone: null,
      code: null,
      no: null,
      uploaded: 0
    }
  }

  expend = () => {
    this.show = true;
    this.forceUpdate();
  }

  renderText = () => {
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

  render () {
    return (
      <div>
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
  return {user: state.user}
}

export default connect(state, actions)(Identity);