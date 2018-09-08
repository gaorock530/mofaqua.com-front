import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../../redux/actions';

class Seller extends Component {
  fakeShop = {

  }
  render () {
    const balance = this.props.user.user?this.props.user.user.balance:0;
    const magic = this.props.user.user?this.props.user.user.magicCoin:0;
    return (
      <div>
        <div>
          <h3>魔法币</h3>
          <p><label>总数:</label><span>{balance.total}</span></p>
          <p><label>可用:</label><span>Lv.10</span></p>
          <p><label>监管:</label><span></span></p>
        </div>
        <div>
          <h3>保证金</h3>
          <p><label>¥1000</label><a>充值</a></p>
        </div>
        <div>
          <h3>注销店铺</h3>
          <p><a>注销</a></p>
        </div>
      </div>
    )
  }
}

const state = (state) => {
  return {user: state.user}
}

export default connect(state, actions)(Seller);

/*
              <div>
                <p><input type="text" placeholder="企业全称" /></p>
                <p><input type="text" placeholder="企业法人姓名" /></p>
                <p><input type="text" placeholder="企业法人手机" /></p>
                <p><input type="text" placeholder="企业法人身份证号码" /></p>
                <p><input type="text" placeholder="营业执照编号" /></p>
                <Upload className="idSide" id="idup" onChange={this.change} color="#666699" opt={false} crop={false} type='id-a'>身份证正面</Upload>
                <Upload className="idSide" id="iddown" onChange={this.change} color="#666699" opt={false} crop={false} type='id-b'>身份证反面</Upload>
                <button>提交</button>
              </div>
*/