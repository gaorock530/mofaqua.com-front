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