import React, { PureComponent } from 'react';
import Add from '../../../components/add';
import Input from '../../../components/forms/input';
import Select from '../../../components/forms/select';
import Save from '../../../components/forms/save';

/**
 * @param {Function} onSave fires when click save
 */

export default class Addlife extends PureComponent {
  constructor (props) {
    super(props);
    this.data = {
      name: '',
      num: 1,
      cate: 1
    };
  }

  onInput = (text) => {
    this.data.name = text.trim();
  }

  onNumer = (num) => {
    this.data.num = parseInt(num, 10);;
  }
  onCate = (value) => {
    this.data.cate = parseInt(value, 10);
    this.forceUpdate();
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
      <Add className="add-life">
        <Input tag="生物名称" onBlur={this.onInput}/>
        <Input tag="数量" type="number" onBlur={this.nNumer} default={this.data.num}/>
        <Select options={[
          {
            label: '鱼类',
            value: 1
          },
          {
            label: '珊瑚',
            value: 2
          },
          {
            label: '清洁类',
            value: 3
          },
          {
            label: '藻类',
            value: 4
          },
          {
            label: '其他',
            value: 5
          }
        ]} tag="分类" default={this.data.cate} onChange={this.onCate}/>
        <Save tag="保存" onClick={this.onSave}/>
      </Add>
    )
  }
}


