import React, { PureComponent } from 'react';
import {Redirect} from 'react-router-dom';
import { connect } from 'react-redux';
import cuid from 'cuid';
import style from '../../../helper/style';
import Page from '../../../components/page';
// import Spinner from '../../../components/animates/spinner';
import * as actions from '../../../redux/actions';
import formatNumber from '../../../helper/formatNumber';
// import Upload from '../../../components/upload';

import Home from './home';
import Tank from './tank';
import Post from './post';
import Result from './result';
import Second from './second';
import Vlog from './vlog';
import Playlist from './playlist';

class Channel extends PureComponent {
  constructor (props) {
    super(props);
    // store new styles indexes in styleSheet
    this.cover = null;
  }
  componentWillMount () {
    console.log(this.props.match.params.id);
    this.notFound = false;
    this.getContent();
  }

  componentDidMount () {
    console.log('---------------this.refs.nav----------------');
    for (let el of this.refs.nav.childNodes) {
      if (!el.getAttribute('data-name')) continue;
      console.log(el.getAttribute('data-name'))
      el.addEventListener('click', () => {
        console.log(1);
        if (this.props.page.channelTab === el.getAttribute('data-name')) return;
        this.props.set_channel_tab(el.getAttribute('data-name'));
      })
    }
  }

  componentWillUnmount () {
    this.props.set_channel_tab('home');
    // remove styles
    if (this.cover) style.del(this.cover);
  }

  getContent = async () => {
    if (this.props.ws.connection) {
      try{
        const res = await this.props.get_channel(this.props.match.params.id);
        if (!res){
          this.notFound = true;
        } else {
          this.cover = style.add(".channel-banner.display", "background-image: url('" + this.channel.cover + "')");
        }
      }catch(e) {
        this.notFound = true;
        this.props.notification_in(cuid(), e);
      }
    }
  }

  onKeyDown = (e) => {
    if (e.keyCode === 13) {
      this.props.toggle_channel_search();
      this.props.set_channel_tab('result');
    } else if (e.keyCode === 27) {
      this.props.toggle_channel_search();
    }
  }

  renderContent = () => {
    switch (this.props.page.channelTab) {
      case 'home':
        return <Home />;
      case 'tank':
        return <Tank />;
      case 'post':
        return <Post />;
      case 'result':
        return <Result />;
      case 'second':
        return <Second />;
      case 'vlog':
        return <Vlog />;
      case 'playlist':
        return <Playlist />;
      default:
        return <Home />;
    }
  }
  render () {
    this.channel = this.props.user.channel;
    return this.notFound? <Redirect exact to='/' />:
    (
      <Page>
        <div className="channel-banner display"></div>
        <section className="channel-header">
          <div className="channel-wrapper">
            <div className="channel-title">
              <div className="user-img">{this.channel?<img alt="" src={this.channel.pic}/>:''}</div>
              <div className="user-title">
                <h1>{this.channel?this.channel.name:''}</h1>
                <h5>{this.channel? formatNumber(this.channel.subscriber):''}<span>位订阅者</span></h5>
              </div>
              <div className="user-sub">
                <a>订阅</a>
              </div>
            </div>
            <div className={this.props.page.mininav?"channel-nav open":"channel-nav"} ref="nav">
              <a className="mini" onClick={this.props.toggle_mini_nav}><i className={this.props.page.mininav?"fa fa-chevron-up":"fa fa-chevron-down"}></i></a>
              <a className={this.props.page.channelTab === 'home'? 'active':''} data-name="home">主页</a>
              <a className={this.props.page.channelTab === 'vlog'? 'active':''} data-name="vlog">全部视频</a>
              <a className={this.props.page.channelTab === 'playlist'? 'active':''} data-name="playlist">视频列表</a>
              <a className={this.props.page.channelTab === 'post'? 'active':''} data-name="post">经验分享</a>
              <a className={this.props.page.channelTab === 'tank'? 'active':''} data-name="tank">美缸档案</a>
              <a className={this.props.page.channelTab === 'second'? 'active':''} data-name="second">二手闲置</a>
              <a>
                {this.props.page.channelSearch? 
                <input type="text" onBlur={this.props.toggle_channel_search} autoFocus  onKeyDown={this.onKeyDown}/>:
                <i onClick={this.props.toggle_channel_search} className="fa fa-search"></i>
                }
              </a>
            </div>
          </div>
        </section>
        <section>{this.renderContent()}</section>
      </Page>
    )
  }
}

export default connect(state => state, actions)(Channel);