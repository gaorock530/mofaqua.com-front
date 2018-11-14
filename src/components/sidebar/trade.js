import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../redux/actions';
import { Link } from 'react-router-dom';

class Setup extends PureComponent {
  componentDidMount () {
    for (let el of this.refs.top.children) {
      if (el.tagName === 'A') {
        el.addEventListener('click', this.props.toggle_sidebar, {once: true});
      }
    }
  }

  render () {
    return (
      <div className="sidebar-list sidebar-el" ref="top">
        <div className="sidebar-menu-title">交易</div>
        <Link to="/shop"><i className="fa fa-cart-plus"></i><span>我要买</span></Link> 
        <Link to="/channel?t=second"><i className="fa fa-recycle"></i><span>我要卖</span></Link>  
        <Link to="/teamup"><i className="fa fa-plane"></i><span>开团</span></Link> 
        <Link to="/teamin"><i className="fa fa-paper-plane"></i><span>跟团</span></Link> 
      </div>
    )
  }
}

export default connect(null, actions)(Setup);