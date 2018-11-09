import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import Button from '../../../components/forms/button';
import * as actions from '../../../redux/actions';

class Seller extends PureComponent {
  fakeShop = {

  }
  render () {
    // const balance = this.props.user.user?this.props.user.user.balance:0;
    const magic = this.props.user.user?this.props.user.user.magicCoin:0;
    return (
      <div>
        <div>
          <h3>魔法币</h3>
          <p><label>总数:</label><span>{magic.total}</span></p>
          <p><label>可用:</label><span>{magic.total - magic.onhold}</span></p>
          <p><label>监管:</label><span>{magic.onhold}</span></p>
        </div>
        <div>
          <h3>保证金</h3>
          <p><label>¥1000</label><Button text="充值"/></p>
        </div>
        <div>
          <h3>注销店铺</h3>
          <p><Button text="注销" simple={true}/></p>
        </div>
      </div>
    )
  }
}


export default connect(({user}) => ({user}), actions)(Seller);
