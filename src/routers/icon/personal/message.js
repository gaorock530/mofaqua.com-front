import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../../redux/actions';
import Button from '../../../components/forms/button';
import moment from 'moment';



class Message extends PureComponent {
  constructor (props) {
    super(props);
    this.read = [];
    this.message = [];
    this.expend = null;
    this.selected = [];
  }
  async componentWillMount () {
    this.a = this.props.attach('msg-a', (e) => {
      // prevent self firing event twice
      if (this.selfFire) return this.selfFire = false;
      this.props.add_msg(null, e);
      this.props.notification_in('新消息！');
    });
    this.d = this.props.attach('msg-d', (e) => {
      this.props.del_msg(null, e);
      this.props.notification_in('消息已删除');
    });
    window.addEventListener('beforeunload', this.saveData, {once: true});
    await this.props.get_msg(this.props.user.user.UID);
  }

  componentWillUnmount () {
    // detech WS events when component Unmounted
    this.props.detech('msg-d', this.d);
    this.props.detech('msg-a', this.a);
    window.removeEventListener('beforeunload', this.saveData);
    this.saveData();
  }
  // make sure only save data to server 
  // when user close window OR switch page
  // to prevent frequent saving traffic
  saveData = () => {
    if (this.read.length !== 0) {
      this.props.save_msg(this.props.user.user.UID, this.read);
    }
  }

  onClick = async (id) => {
    this.expend = this.expend === id || this.over? null: id;
    for (let i of this.message) {
      if (i.id === id) {
        if (!i.msg) this.props.get_msg(this.props.user.user.UID, id);
        if (!i.read && !this.over) {
          i.read = true; 
          this.read.push(id);
          this.props.update_msg(id);
        }
        if (this.over) {
          i.c = !i.c;
          if (i.c) this.selected.push(i.id);
          else this.selected.splice(this.selected.indexOf(id), 1);
        } 
      }
    }
    this.forceUpdate();
  }
  // for testing
  add = () => {
    const msg = {
      from: 'system',
      type: 1,
      title: Math.random() * 10 + 'asdasdasd',
      msg: '阿隆索大；蓝色短裤了；阿斯顿阿斯利康的'
    }
    this.props.add_msg(this.props.user.user.UID, msg);
    this.selfFire = true;
  }

  all = () => {
    this.message.map((m) => m.c = true);
    this.selected = this.message.map(i => i.id);
    this.forceUpdate();
  }
  cancel = () => {
    this.message.map((m) => m.c = false);
    this.selected = [];
    this.forceUpdate();
  }

  delete = () => {
    if (this.selected.length === 0) return;
    // this.message = this.message.filter((m) => !m.c);
    this.props.del_msg(this.props.user.user.UID, this.selected);
  }

  renderMsg = () => {
    if (this.message.length === 0) return '没有消息';
    return this.message.map((m) => {
      const cssCheck = 'message-t' + (this.expend === m.id? ' select': '');
      return (
        <div key={m.id} className='message-wrapper'>
          <h5 className={cssCheck}  onClick={this.onClick.bind(this, m.id)}>
            <div className="main">
              <i className={'fa fa-' + (m.c? 'check-square':'square') + ' check'}
              onMouseEnter={() => this.over = true}
              onMouseLeave={() => this.over = false}></i>
              <span className="title">{m.title}</span>
            </div>
            <div className="side"> 
              <i className={"fa fa-" + (!m.read?'envelope':'envelope-open') + ' dot'}></i>
              <span>系统 </span>
            </div>
          </h5>
          {this.expend === m.id?<div className="message-m">
            <span className="purple">{moment.utc(m.date).format('YYYY-MM-DD HH:mm:ss')} </span>
            {m.msg}
          </div>:''}
        </div>
      )
    })
  }

  render () {
    this.message = this.props.message;
    return (
      <div>
        <div style={{'textAlign': 'right'}}>
          <Button text="增加" onClick={this.add}/>
          <Button text="全选" onClick={this.all} disable={this.selected.length === this.message.length}/>
          <Button text="取消选择" onClick={this.cancel} disable={this.selected.length === 0}/>
          <Button text="删除" onClick={this.delete} disable={this.selected.length === 0}/>
        </div>
        <div>
          {this.renderMsg()}
        </div>
      </div>
    )
  }
}

export default connect(({user, message, page, notification}) => ({user, message, page, notification}), actions)(Message);