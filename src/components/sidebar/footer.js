import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../redux/actions';

class Footer extends PureComponent {
  componentDidMount () {
    for (let el of this.refs.top.children) {
      this.addEvent(el);
    }
  }

  addEvent = (el) => {
    for (let e of el.children) {
      if (e.tagName === 'A') {
        e.addEventListener('click', this.props.toggle_sidebar, {once: true});
      }
    }
  }

  render () {
    return (
      <div className="sidebar-footer" ref="top">
        <div className="links">
          <a href="http://www.baidu.com">关于</a>
          <a href="http://www.baidu.com">加入</a>
          <a href="http://www.baidu.com">推广</a>
          <a href="http://www.baidu.com">品牌</a>
          <a href="http://www.baidu.com">广告</a>
          <a href="http://www.baidu.com">活动</a>
        </div>
        <div className="links">
          <a href="http://www.baidu.com">开发者</a>
          <a href="http://www.baidu.com">版权</a>
          <a href="http://www.baidu.com">政策与安全</a>
          <a href="http://www.baidu.com">条款与声明</a>
        </div>
        <div className="links">
          <a href="http://www.baidu.com" target="_blank" rel="noopener noreferrer">报错</a>
          <a href="http://www.baidu.com" target="_blank" rel="noopener noreferrer">沪ICP备15043293号</a>
          <a href="http://www.baidu.com" target="_blank" rel="noopener noreferrer">沪网文[2015]0826-226号</a>
          <a href="http://www.baidu.com" target="_blank" rel="noopener noreferrer">沪公网安备 31010802001046号</a>
        </div>
        <div className="copyright">© 2018 Reef Magic, <a href="https://www.yingxitech.com" target="_blank" rel="noopener noreferrer">ShadowStrike</a></div>
      </div>
    )
  }
}

export default connect(null, actions)(Footer);