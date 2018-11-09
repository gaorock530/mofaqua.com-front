import React, { PureComponent } from 'react';
import Button from '../../../components/forms/button';
import { connect } from 'react-redux';

class Account extends PureComponent {
  render () {
    return (
      <div>
        <div>
          <h3>账户余额</h3>
          <p><label>¥30</label><Button text="充值"/></p>
        </div>
        
      </div>
    )
  }
}

export default connect(state => state)(Account);