import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../../redux/actions';
import cuid from 'cuid';
import Page from '../../../components/page';
// import Select from '../../../components/forms/select';
import List from '../../../components/forms/list';
import Textarea from '../../../components/forms/textarea';
import Input from '../../../components/forms/input';
import Save from '../../../components/forms/save';
import Warning from '../../../components/forms/warning';

/**
 * @param {Function} onSave fires when click save
 */

class EditList extends PureComponent {
  constructor (props) {
    super(props);
    this.data = {
      name: '',
      description: '',
      list: [
        {pic: '/pic/reef-1.jpg', title: '123', index: 0, id: cuid()},
        {pic: '/pic/reef-1.jpg', title: '123asdaslkdjasldkjasdlkjasdlkjaslkdjaslkdjaslkdjaslkdj3', index: 1, id: cuid()},
        {pic: '/pic/reef-1.jpg', title: '1234', index: 2, id: cuid()},
      ]
    }; 
    this.limit = false;
  }
  componentWillMount () {
  }
  listChange = (list) => {
    this.data.list = list;
    console.log(list);
    this.forceUpdate();
  }
  onTextarea = (count) => {
    if (count>20) {
      if (!this.limit) {
        this.limit = true;
        this.forceUpdate();
      }
    } else {
      if (this.limit) {
        this.limit = false;
        this.forceUpdate();
      }
    }
  }


  onSave = () => {
    if (this.data.name === '' || this.data.num < 1) return;
    if (this.props.onSave) {
      if (isNaN(this.data.num)) this.data.num = 1;
      this.props.onSave(this.data);
    }
  }

  render () {
    return (
      <Page wapper={true}>
        <Input tag="列表名称" defalut={this.props.title || ''}/>
        <Textarea tag="列表介绍" text="测试" onBlur={(value) => {console.log(value)}} onChange={this.onTextarea}/>
        {this.limit?<Warning text="字数限制：20"/>:''}
        <List data={this.data.list} onChange={this.listChange}/>
        <Save tag="保存更改" onClick={this.onSave}/>
        <Save tag="删除列表" red={true} onClick={this.onSave}/>
      </Page>
    )
  }
}

export default connect(state => state, actions)(EditList);