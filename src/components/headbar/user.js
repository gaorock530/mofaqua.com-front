import React, {Component} from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import style from '../../helper/style';
import prefix from '../../helper/prefix';

import Expend from './expend';
import Logout from './logout';


import * as actions from '../../redux/actions';


class User extends Component {  
  componentDidMount () {
    // store new styles indexes in styleSheet
    this.index = [];
  }

  setLang = (lang) => {
    this.props.set_language(lang);
    this.props.set_temp(null);
  }

  enterLang = () => {
    this.props.set_temp('language');
  }
  leaveLang = (e) => {
    this.props.set_temp(null);
  }

  open = () => {
    // add styles
    const index = style.add(".experience-bar:before", "content: '" + this.props.user.user.person.exp + "/1000'");
    style.add(".experience-bar:after", "width: " + Math.floor(this.props.user.user.person.exp/1000*100) + "%");
    this.index = [index, index];
  }
  close = () => {
    // this.props.set_expend_active();
    this.props.set_temp(null);
    this.index.map((index) => style.del(index))
    this.index = [];
  }


  renderLang = () => {
    if (this.props.page.temp === 'language') {
      return (
        <div className="sub-user">
          <div className="lang back" onClick={this.leaveLang}><i className="fa fa-arrow-left"></i></div>
          <div className="lang" onClick={this.setLang.bind(this, 'zh')}>简体中文</div>
          <div className="lang" onClick={this.setLang.bind(this, 'zh')}>繁体中文</div>
          <div className="lang" onClick={this.setLang.bind(this, 'en')}>English</div>
        </div>
      )
    } else {
      return '';
    }
  }
  
  render () {
    return (
      <div className="user-icon">
        <img alt="" src={prefix(this.props.user.user.pic)} onClick={this.props.set_expend_active.bind(this,'Icon')}/>
        {this.props.page.expendActive !== 'Icon' ? '' : (
          <Expend close={this.close} open={this.open}>
            <div className="user-stats">
              <div className="user-stats-row user-info">
                <div className="user-icon-l"><img alt="" src={prefix(this.props.user.user.pic)}/></div>
                <div className="user-icon-inner">
                  <span className="user-name">{this.props.user.user.username}</span>
                  <div className="user-activity col-end inactive"></div>
                </div>
              </div>
              <div className="user-stats-row">
                <span>我的等级</span>
                <span>Lv.{this.props.user.user.person.level}</span>
              </div>
              <div className="user-stats-row">
                <span>我的经验</span>
                <span className="experience-bar"></span>
              </div>
            </div>
            <div>
              <Link onClick={this.props.set_expend_active} to="/personal" className="expend-list"><i className="fa fa-user"></i><span>个人信息</span></Link>
              <Link onClick={this.props.set_expend_active} to="/channel" className="expend-list"><i className="fa fa-tv"></i><span>我的频道</span></Link>
              <Link onClick={this.props.set_expend_active} to="/mytank" className="expend-list"><i className="fa fa-tint"></i><span>我的美缸</span></Link>
            </div>
            <div>
              <a className="expend-list"><i className="fa fa-tachometer-alt"></i><span>切换主题: 夜间</span></a>
              {/* <a className="expend-list" onClick={this.enterLang}><i className="fa fa-language"></i><span>语言: 简体中文</span></a> */}
              <a className="expend-list"><i className="fa fa-language"></i><span>语言: 简体中文</span></a>
              <Link onClick={this.props.set_expend_active} to="/setup" className="expend-list"><i className="fa fa-cog"></i><span>设置</span></Link>
            </div>
            <Logout />
            {this.renderLang()}
          </Expend>
        )}      
      </div>
    )
  }
}

export default connect(state => state, actions)(User);