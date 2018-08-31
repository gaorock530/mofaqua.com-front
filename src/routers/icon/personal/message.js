import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../../redux/actions';

import cuid from 'cuid';


class Message extends PureComponent {
  constructor (props) {
    super(props);
    this.show = false;
    
  }
  render () {
    return (
      <div>Message</div>
    )
  }
}

const state = (state) => {
  return {user: state.user}
}

export default connect(state, actions)(Message);