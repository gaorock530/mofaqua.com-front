import React, {Component} from 'react';
import { connect } from 'react-redux';
// import * as actions from '../redux/actions';

import NotificationItem from './notification-item';

class Notification extends Component {
  render () {
    const renderNotice = () => {
      return this.props.notification.map(item => {
        return <NotificationItem key={item.id} id={item.id} text={item.text} pic={item.pic}/>
      })
    }
    return (
      <div className="notice">
        {renderNotice()}
      </div>
    )
  }
}

export default connect(state => state, null)(Notification);