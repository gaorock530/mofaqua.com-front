import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import Upload from '../../../components/upload';

class Identity extends PureComponent {

  change = (file) => {
    console.log(file);
    console.log(this.props.page.uploadFiles);
  }

  render () {
    const identity = this.props.user.user.verification;
    return (
      <div>
        <div>
          <h3>实名认证</h3>
          <p><a>{!identity?'':identity.verified?'已认证':'未认证'}</a></p>  
        </div>
        {!identity || identity.verified ?"":
          <div>
            <h3>提交资料</h3>
            <p>
              <label>
                <input type="radio" name="id" value="0" defaultChecked />
                个人
              </label>
              <label>
                <input type="radio" name="id" value="1" />
                企业
              </label>
            </p>
            <div>
              <p><input type="text" placeholder="姓名" /></p>
              <p><input type="text" placeholder="手机" /></p>
              <p><input type="text" placeholder="身份证号码" /></p>
              <Upload className="idSide" id="idup" onChange={this.change} color="#666699" opt={false} crop={false}>身份证正面</Upload>
              <Upload className="idSide" id="iddown" onChange={this.change} color="#666699" opt={false} crop={false}>身份证反面</Upload>
              <button>提交</button>
            </div>
          </div>
        }  
      </div>
    )
  }
}

export default connect(state => state)(Identity);