import React, {Component} from 'react';
import { connect } from 'react-redux';

import Expend from './expend';


import * as actions from '../../redux/actions';

class UserUtils extends Component {
  render () {
    return (
      <div className="user-notification" onClick={this.props.set_expend_active.bind(this,'Notification')}>
        <i className="fa fa-bell">{!this.props.user.notice?<div className="number">1</div>:""}</i>
        {this.props.page.expendActive !== 'Notification' ? '' : (
          <Expend>
            <div>
              <a className="expend-list"><i className="fa fa-heart"></i><span>love you</span></a>
              <a className="expend-list"><i className="fa fa-heart"></i><span>asdaasdasdasdasdasdasdasdsd</span></a>
              <a className="expend-list"><i className="fa fa-heart"></i><span>asdasdasdasasd</span></a>
            </div>
          </Expend>
        )}
      </div>
    )
  }
}

export default connect(state => state, actions)(UserUtils);