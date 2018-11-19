import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../../redux/actions';

import Options from '../../../components/forms/options';

class Channel extends PureComponent {
  constructor () {
    super();
    // this list should be database
    this.list = [
      {
        tag: '对外公开',
        list: ['所有人', '仅朋友', '仅自己'],
        sub: '*对所有人可见会增加频道热度',
        default: 0,
      },
      {
        tag: '频道统计',
        sup: '对于已开启通知功能的特定频道，通过以下方式通知您:',
        list: ['app推送和电子邮件', '仅限app推送', '仅通过电子邮件接收'],
        default: 0,
      },
      {
        tag: '自定义计划提醒通知',
        sub: '*接收每条短信通知将扣除5魔法币',
        list: ['app通知', '短信通知', '邮件通知'],
        default: 0,
      },
    ]
  }

  onChange = (i, d) => {
    
    if (this.list[i].default === d) return;
    console.log(i, d);
    this.list[i].default = d;
    this.forceUpdate();
  }

  renderList = () => {
    return this.list.map((list, i) => 
      (
        <Options key={i} tag={list.tag} data={list.list} sup={list.sup} sub={list.sub}
        onChange={this.onChange.bind(this, i)} default={list.default}/>
      )
    )
    
    
  }

  render () {
    
    return (
      <div>
        <div>
          {this.renderList()}
        </div>
      </div>
    )
  }
}

export default connect(({user}) => ({user}), actions)(Channel);