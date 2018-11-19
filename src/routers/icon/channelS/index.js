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
    // this.search = this.props.location.search.slice(1).split('&');
    // if (this.search.length !== 0 && this.search[0] !== '') {
    //   this.search.map((search) => {
    //     const tab = search.split('=');
    //     if (tab[0] === 't') {
    //       this.tab = tab[1];
    //     }
    //     return true;
    //   });
    // } 
    this.nav = [
      {k: 'vlog', v: '全部视频'},
      {k: 'playlist', v: '视频列表'}, 
      {k: 'post', v: '经验分享'}, 
      {k: 'tank', v: '我的美缸'}, 
      {k: 'second', v: '二手闲置'}
    ];
    // this.tab = this.tab || 'vlog';
    this.props.set_channel_tab(this.tab || 'vlog');
    try{
      await this.props.get_channel(this.props.user.user.UID);
    }catch(e) {
      this.props.notification_in(cuid(), e);
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

  renderNav = () => {
    return this.nav.map(nav => {
      return  <a key={nav.k}
      className={this.props.page.channelTab === nav.k? 'active':null} 
      onClick={this.props.set_channel_tab.bind(this, nav.k)}>{nav.v}</a>
    })
  }

  render () {
    const cover = this.props.user.channel && this.props.user.channel.cover? this.props.user.channel.cover : '';
    return (
      <Page className="flat">
        <Upload className="channel-banner setup" color="#666699" id="cover" width={1920} height={350} crop={true} opt={true} type="ch-cover" image={prefix(cover)}>更换封面</Upload>
        <section className="channel-header">
          <div className="channel-title">
            <div className="user-img"><img alt="" src={prefix(this.props.user.user.pic)}/></div>
            <div className="user-title">
              <h1>{this.props.user.user.username}</h1>
              <h5>{this.props.user.channel? formatNumber(this.props.user.channel.subscriber):''}<span>位订阅者</span></h5>
            </div>
          </div>
          <div className={this.props.page.mininav?"channel-nav open":"channel-nav"} ref="nav">
            <a className="mini" onClick={this.props.toggle_mini_nav}><i className={this.props.page.mininav?"fa fa-chevron-up":"fa fa-chevron-down"}></i></a>
            {this.renderNav()}
            <a>
              {this.props.page.channelSearch? 
              <input type="text" onBlur={this.props.toggle_channel_search} autoFocus onKeyDown={this.onKeyDown}/>:
              <i onClick={this.props.toggle_channel_search} className="fa fa-search"></i>
              }
            </a>
          </div>
        </section>
        <section>{this.renderContent()}</section>
      </Page>
    )
  }
}

export default connect(({page, user}) => ({page, user}), actions)(Channel);