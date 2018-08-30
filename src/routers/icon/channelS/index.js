import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import cuid from 'cuid';
import * as actions from '../../../redux/actions';
import Upload from '../../../components/upload';
import formatNumber from '../../../helper/formatNumber';
import prefix from '../../../helper/prefix';
import Page from '../../../components/page';
import Tank from './tank';
import Post from './post';
import Result from './result';
import Second from './second';
import Vlog from './vlog';
import Playlist from './playlist';

class Channel extends PureComponent {
  async componentWillMount () {
    // console.log(this.props.location.search.slice(1).split('&'));
    this.search = this.props.location.search.slice(1).split('&');
    if (this.search.length !== 0 && this.search[0] !== '') {
      this.search.map((search) => {
        const tab = search.split('=');
        if (tab[0] === 't') {
          this.tab = tab[1];
        }
        return true;
      });
    } 
    this.tab = this.tab || 'vlog';
    this.props.set_channel_tab(this.tab);
    try{
      await this.props.get_channel(this.props.user.user.UID);
    }catch(e) {
      this.props.notification_in(cuid(), e);
    }
    
  }
  componentDidMount () {
    for (let el of this.refs.nav.childNodes) {
      if (el.getAttribute('data-name')) {
        el.addEventListener('click', () => {
          if (this.props.page.channelTab === el.getAttribute('data-name')) return;
          this.props.set_channel_tab(el.getAttribute('data-name'));
        })
      }
    }
  }

  componentWillUnmount () {
    // reset tab to first tab
    this.props.set_channel_tab('vlog');
    // clear data
    this.props.set_lazyload();
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
      case 'tank':
        return <Tank />;
      case 'post':
        return <Post />;
      case 'result':
        return <Result />;
      case 'second':
        return <Second />;
      case 'vlog':
        return <Vlog num={10} />;
      case 'playlist':
        return <Playlist num={10} />;
      default:
        return <Vlog num={10} />;
    }
  }

  render () {
    const cover = this.props.user.channel && this.props.user.channel.cover? this.props.user.channel.cover : '';
    return (
      <Page className="flat">
        <Upload className="channel-banner setup" color="#666699" id="cover" width={1920} height={350} crop={true} opt={true} type="ch-cover" image={prefix(cover)}>更换封面</Upload>
        <section className="channel-header">
          <div className="channel-wrapper">
            <div className="channel-title">
              <div className="user-img"><img alt="" src={prefix(this.props.user.user.pic)}/></div>
              <div className="user-title">
                <h1>{this.props.user.user.username}</h1>
                <h5>{this.props.user.channel? formatNumber(this.props.user.channel.subscriber):''}<span>位订阅者</span></h5>
              </div>
            </div>
            <div className={this.props.page.mininav?"channel-nav open":"channel-nav"} ref="nav">
              <a className="mini" onClick={this.props.toggle_mini_nav}><i className={this.props.page.mininav?"fa fa-chevron-up":"fa fa-chevron-down"}></i></a>
              <a className={this.props.page.channelTab === 'vlog'? 'active':''} data-name="vlog">全部视频</a>
              <a className={this.props.page.channelTab === 'playlist'? 'active':''} data-name="playlist">视频列表</a>
              <a className={this.props.page.channelTab === 'post'? 'active':''} data-name="post">经验分享</a>
              <a className={this.props.page.channelTab === 'tank'? 'active':''} data-name="tank">我的美缸</a>
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