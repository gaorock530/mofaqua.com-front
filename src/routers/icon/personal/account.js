import React, { Component } from 'react';
import { connect } from 'react-redux';

class Account extends Component {
  render () {
    return (
      <div>
        <div>
          <h3>账户余额</h3>
          <p><label>¥30</label><a>充值</a></p>
        </div>
        
      </div>
    )
  }
}

export default connect(state => state)(Account);