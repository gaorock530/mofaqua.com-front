import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as actions from '../../redux/actions';

class Expend extends Component {

  render() {
    return (
      <div className="menu-expend noselect" onMouseLeave={this.props.onMouseLeave || this.props.set_expend_active}>
        {this.props.children}
      </div>
    );
  }
}

export default connect(null, actions)(Expend);