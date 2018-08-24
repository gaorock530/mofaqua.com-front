import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../redux/actions';
import { Link } from 'react-router-dom';

class Category extends Component {
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
        <div className="sidebar-menu-title">分类</div>
        <Link to="/livestock"><i className="fa fa-bug"></i><span>生物</span></Link>  
        <Link to="/gear"><i className="fa fa-suitcase"></i><span>器材</span></Link>
        <Link to="/food"><i className="fa fa-leaf"></i><span>鱼粮</span></Link>
        <Link to="/tanks"><i className="fa fa-tint"></i><span>美缸</span></Link>
        <Link to="/experience"><i className="fa fa-mortar-board"></i><span>经验</span></Link>
        <Link to="/videos"><i className="fa fa-video-camera"></i><span>视频</span></Link>
        <Link to="/live"><i className="fa fa-heartbeat"></i><span>直播</span></Link>
      </div>
    )
  }
}

export default connect(state => state, actions)(Category);