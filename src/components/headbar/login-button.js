import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import {Link} from 'react-router-dom';

import Spinner from '../animates/spinner';


import * as actions from '../../redux/actions';

class LoginButton extends PureComponent {
  
  render () {
    return (
      <div className="user-login">
        {this.props.user.loggingAction ? 
          <Spinner size="12px" /> : 
          <Link to="/login">登陆</Link>
        }
      </div>
    )
  }
}

export default connect(({user}) => ({user}), actions)(LoginButton);