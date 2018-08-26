import React, {PureComponent} from 'react';
import { connect } from 'react-redux';

import Expend from './expend';


import * as actions from '../../redux/actions';

class UserUtils extends PureComponent {
  render () {
    return (
      <div ref="icon" className="user-tools" onClick={this.props.set_expend_active.bind(this, 'Tools')}>
        <i className="fa fa-th-large"></i>
        {this.props.page.expendActive !== 'Tools' ? '' : (
          <Expend>
            <div>
              <a className="expend-list"><i className="fa fa-shopping-bag"></i><span>购物车</span></a>
            </div>
            <div>
              <a className="expend-list"><i className="fa fa-video-camera"></i><span>视频日记</span></a>
              <a className="expend-list"><i className="fa fa-graduation-cap"></i><span>经验分享</span></a>
              <a className="expend-list"><i className="fa fa-photo"></i><span>美缸照片</span></a>
              <a className="expend-list"><i className="fa fa-eyedropper"></i><span>水质数据</span></a>
            </div>
            <div>
              <a className="expend-list"><i className="fa fa-comments"></i><span>聊天记录</span></a>
              <a className="expend-list"><i className="fa fa-money"></i><span>交易记录</span></a>
              <a className="expend-list"><i className="fa fa-heartbeat"></i><span>我要直播</span></a>
            </div>
          </Expend>
        )}
      </div>
    )
  }
}

export default connect(state => state, actions)(UserUtils);