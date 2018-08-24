import React, { PureComponent } from 'react';
import Add from '../../../components/add';
import Input from '../../../components/forms/input';
// import Radio from '../../../components/forms/radio';
// import Checkbox from '../../../components/forms/checkbox';
import Select from '../../../components/forms/select';
import Save from '../../../components/forms/save';

/**
 * @param {Function} onSave fires when click save
 */

export default class Addgear extends PureComponent {
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
        <Input tag="设备名称" onBlur={this.onInput}/>
        <Input tag="数量" type="number" onBlur={this.onNumer} default={this.data.num}/>
        <Select options={[
          {
            label: '灯具',
            value: 1
          },
          {
            label: '水泵',
            value: 2
          },
          {
            label: '造浪',
            value: 3
          },
          {
            label: '蛋分',
            value: 4
          },
          {
            label: '加热',
            value: 5
          },
          {
            label: '制冷',
            value: 6
          },
          {
            label: '反应器',
            value: 7
          },
          {
            label: '滤材',
            value: 8
          },
          {
            label: '其他',
            value: 9
          }
        ]} tag="分类" default={this.data.cate} onChange={this.onCate}/>
        <Save tag="保存" onClick={this.onSave}/>
      </Add>
    )
  }
  
}


