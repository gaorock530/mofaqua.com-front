import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import * as actions from '../../redux/actions';

class More extends Component {
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
        <div className="sidebar-menu-title">应用</div>
        <Link to="/ask"><i className="fa fa-question"></i><span>我要提问</span></Link>  
        <Link to="/answer"><i className="fa fa-reply-all"></i><span>我要回答</span></Link> 
        <Link to="/calculator"><i className="fa fa-flask"></i><span>计算工具</span></Link> 
      </div>
    )
  }
}

export default connect(state => state, actions)(More);