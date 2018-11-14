import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../redux/actions';
import { Link } from 'react-router-dom';

class Menu extends PureComponent {
  componentDidMount () {
    for (let el of this.refs.top.children) {
      el.addEventListener('click', this.props.toggle_sidebar, {once: true});
    }
  }


  render () {
    return (
      <div className="sidebar-list sidebar-el" ref="top">
        <Link to="/"><i className="fa fa-home"></i><span>首页</span></Link>
        <Link to="/hot"><i className="fa fa-fire"></i><span>时下流行</span></Link> 
        {this.props.user.isLogin ? <Link to="/subscribe"><i className="fa fa-star"></i><span>订阅</span></Link> : ''} 
        {this.props.user.isLogin ? <Link to="/collection"><i className="fa fa-heart"></i><span>收藏</span></Link> : ''} 
        {this.props.user.isLogin ? <Link to="/thumbup"><i className="fa fa-thumbs-up"></i><span>已点赞</span></Link> : ''} 
      </div>
    )
  }
}

export default connect(({user}) => ({user}), actions)(Menu);