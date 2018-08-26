import React, {Component} from 'react';
import { connect } from 'react-redux';

import UserUtils from './user-utils';
import UserNotice from './user-notice';
import User from './user';
import LoginButton from './login-button';
import * as actions from '../../redux/actions';

class Tools extends Component {
  
  render () {
    return (
      <div className="header-tools noselect">
        <div className="user-search" onClick={this.props.toggle_small_window}><i className="fa fa-search"></i></div>
        {this.props.user.isLogin ? <UserUtils />: ''}
        {this.props.user.isLogin ? <UserNotice /> : ''}
        {this.props.user.isLogin ? <User /> : <LoginButton />}
      </div>
    )
  }
}

const userState = (state) => {
  return {user: state.user}
}

export default connect(userState, actions)(Tools);
