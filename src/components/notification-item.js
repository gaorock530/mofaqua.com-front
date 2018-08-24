import React, {Component} from 'react';
import { connect } from 'react-redux';
import * as actions from '../redux/actions';


class NotificationItem extends Component { 
  onClick = (id) => {
    this.props.notification_out(id)
  }
  componentDidMount () {
    if (this.props.pic) {
      this.refs.pic.style.backgroundImage = `url('${this.props.pic}')`;
    }
  }

  render () {
    return (
      <div className="notice-item" ref="item">
        <div className="notice-pic" ref="pic">
          {!this.props.pic? <i className="fa fa-exclamation-circle"></i> :''}
        </div>
        <div className="notice-text">{this.props.text}</div>
        <div className="notice-close"  onClick={this.onClick.bind(this, this.props.id)}>
          <i className="fa fa-times"></i>
        </div> 
      </div>
    )
  }
}

export default connect(state => state, actions)(NotificationItem);