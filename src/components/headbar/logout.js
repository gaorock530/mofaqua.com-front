import React, {PureComponent} from 'react';
import { connect } from 'react-redux';
import * as actions from '../../redux/actions';

class Logout extends PureComponent {
  onClick = (e) => {
    e.preventDefault();
    this.props.user_logout();
    window.location = 'http://localhost:3000/';
    
  }
  
  render () {
    return (
      <div className="user-logout" onClick={this.onClick}>
        <a className="expend-list"><i className="fa fa-power-off"></i><span>退出</span></a>
      </div>
    )
  }
}

export default connect(null, actions)(Logout);