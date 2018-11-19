import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../../redux/actions';
import Options from '../../../components/forms/options';

class Privacy extends PureComponent {
  constructor () {
    super();
    // this list should be database
    this.list = [
      {
        tag: '添加好友',
        list: ['任何人可以添加', '必须经过同意才可添加', '禁止任何人添加'],
        default: 0,
      },
      {
        tag: '聊天与对话',
        list: ['任何人', '仅朋友', '不接收任何人的消息'],
        default: 0,
      }
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

export default connect(({user}) => ({user}), actions)(Privacy);