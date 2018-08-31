import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../../redux/actions';
import axios from 'axios';

class Address extends Component {
  fakeAddress = [
    'asdqweqpoweipoqwie',
    '卡拉斯京看到了啊善良的空间阿斯顿流泪的 上劳动课',
    '阿克苏 k askd kjk卡家是的'
  ]
  renderAddress = () => {
    let key = 0; 
    return this.fakeAddress.map((i) => {
      key++;
      // console.log(this.fakeAddress.indexOf(i));
      if (this.fakeAddress.indexOf(i) === 0) {
        return <p key={key}><label><input type="radio" name="add" value={key} defaultChecked />{i}</label></p>
      }
      return <p key={key}><label><input type="radio" name="add" value={key} />{i}</label></p>
    })
  }

  getLoc = (id = null) => {
    this.props.set_province(id);
  }

  renderOption = () => {
    if (this.props.page.temp === 'add') return (
      <div>
        <h3>地址详情</h3>
        <p>
          <select>
            <option>北京</option>
            <option>上海</option>
            <option>广州</option>
          </select>
          <select>
            <option>北京</option>
            <option>上海</option>
            <option>广州</option>
          </select>
          <select>
            <option>北京</option>
            <option>上海</option>
            <option>广州</option>
          </select>
        </p>
        <p><input type="text" ref="street" placeholder="详细地址"/></p>
        <p><input type="number" ref="zip" placeholder="邮编"/></p>
        <a>保存</a>
      </div>
    )
  }
  addADD = () => {
    this.add = true;
    this.forceUpdate()
  }
  render () {
    return (
      <div>
        <div>
          <h3>地址管理</h3>
          {this.renderAddress()}
          <a onClick={this.addADD}>添加地址</a>
        </div>
        {!this.add?'':
        (
          <div>
            <h3>地址详情</h3>
            <p>
              <select>
                <option>北京</option>
                <option>上海</option>
                <option>广州</option>
              </select>
              <select>
                <option>北京</option>
                <option>上海</option>
                <option>广州</option>
              </select>
              <select>
                <option>北京</option>
                <option>上海</option>
                <option>广州</option>
              </select>
            </p>
            <p><input type="text" ref="street" placeholder="详细地址"/></p>
            <p><input type="number" ref="zip" placeholder="邮编"/></p>
            <a>保存</a>
          </div>
        )
      }
      </div>
    )
  }
}

export default connect(state => state, actions)(Address);