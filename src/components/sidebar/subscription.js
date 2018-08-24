import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../redux/actions';

class Subscription extends Component {
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
        <div className="sidebar-menu-title">订阅内容</div>
        <a><div className="sub-icon"></div><span>1</span></a>  
        <a><div className="sub-icon"></div><span>2</span></a> 
        <a><div className="sub-icon"></div><span>3</span></a> 
        <a><div className="sub-icon"></div><span>4</span></a>
        <a><div className="sub-icon"></div><span>5asdasdasdasd</span></a>
      </div>
    )
  }
}

export default connect(state => state, actions)(Subscription);