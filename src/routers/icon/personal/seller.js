import React, { Component } from 'react';

class Seller extends Component {
  fakeShop = {

  }
  render () {
    return (
      <div>
        <div>
          <h3>店铺信息</h3>
          <p><label>店名:</label><span>海南尚可鱼坊</span></p>
          <p><label>等级:</label><span>Lv.10</span></p>
          <p><label>信誉:</label><span>❤️❤️❤️❤️❤️</span></p>
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

export default Seller;

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