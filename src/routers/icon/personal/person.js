import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../../redux/actions';
// import Error from '../../../components/error';
import style from '../../../helper/style';
import Upload from '../../../components/upload';
import word from '../../../helper/wordcounter';
import prefix from '../../../helper/prefix';
import cuid from 'cuid';


class Person extends Component {
  componentWillUnmount () {
    this.props.change_setup_option(null);
    // remove styles
    this.index.map((index) => style.del(index));
  }
  componentDidMount () {
    //only delete after added!
    this.add = false;
    // store new styles indexes in styleSheet
    this.index = [];
  }
  componentWillReceiveProps () {
    this.percent = Math.floor(Math.random()*10)*100;
  }

  changeName = () => {
    this.props.change_setup_option('name');
  }

  confirmName = () => {
    const name = this.refs.newName.value.trim();
    const len = word(name, true, true);
    console.log('\''+name+'\'', '\''+this.props.user.user.username+'\'');
    if (name === this.props.user.user.username) {
      this.props.change_setup_option(null);
    } else if (name !== '' && !name.match(/[^\w^\u4e00-\u9fa5^'^\s]+/g) && len<=20) {
      this.props.change_setup_option(null);
      this.props.set_username(this.refs.newName.value, this.props.user.user.UID);
    } else {
      this.refs.newName.select();
      this.props.notification_in(cuid(), '不符合规则(20个字母或10个中文');
    }
  }

  onKeyDown = (e) => {
    if (e.keyCode === 13) {
      this.confirmName();
    }
  }
  change = async (file) => {
    
  }

  render () {
    const buyer = this.props.user.user.buyer;
    return (
      <div>
        <div>
          <h3>头像</h3>
          <Upload className="pt" id="icon" round={true} color="#666699" onChange={this.change} width={80} height={80} crop={true} image={prefix(this.props.user.user.pic)}>+</Upload>
        </div>
        <div>
          <h3>用户名</h3>
          {this.props.page.changeSetup !== 'name'?
            <p>
              <label ref="name">{this.props.user.user.username}</label>
              <a onClick={this.changeName}>修改</a>
            </p>:
            <p>
              <input type="text" ref="newName" defaultValue={this.props.user.user.username} onKeyDown={this.onKeyDown}/>
              <a onClick={this.props.change_setup_option}>取消</a>
              <a onClick={this.confirmName}>确定</a>
            </p>
          }
        </div>
        <div>
          <h3>等级和经验值</h3>
          <p>
            <label>等级</label><span>Lv.{this.props.user.user.person.level}</span>
          </p>
          <p>
            <label>经验</label><span>{this.props.user.user.person.exp+'/1000'}</span>
          </p>
        </div>
        <div>
          <h3>交易评估和等级</h3>
          <p>
            <label>等级</label><span>Lv.{buyer?buyer.level:''}</span>
          </p>
          <p>
            <label>经验</label><span>{buyer?buyer.exp+'/1000':''}</span>
          </p>
          <p>
            <label>信用值</label><span>{buyer?buyer.credit: ''}</span>
          </p>
        </div>
      </div>
    )
  }
}

export default connect(state => state, actions)(Person);