import React, { Component } from 'react';
// import { connect } from 'react-redux';
// import * as actions from '../../../redux/actions';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import Add from '../../../components/add';
import Input from '../../../components/forms/input';
import Select from '../../../components/forms/select';
import Save from '../../../components/forms/save';

/**
 * @param {Function} onSave fires when click save
 */

export default class AddTest extends Component {
  constructor (props) {
    super(props);
    this.l = ['Temp', 'PH', 'KH', 'NH3', 'NO2', 'NO3', 'PO4', 'Ca', 'Mg', 'Cu'];
    this.data = {
      res: 0,
      cate: 2,
      unit: '',
      date: new Date(Date.now())
    };
    this.table = {
      'Temp': ['°C', '°F'], 
      'PH': null, 
      'KH': ['dKH'], 
      'NH3': ['ppm'], 
      'NO2': ['ppm'], 
      'NO3': ['ppm'], 
      'PO4': ['ppm', 'ppb'], 
      'Ca': ['ppm'], 
      'Mg': ['ppm'], 
      'Cu': ['ppm']
    }
  }
  renderPara = () => {
    return this.l.map((op, index) => {
      return {label: op, value: index};
    })
  }

  onNumer = (num) => {
    this.data.res = parseFloat(num, 10);
  }

  onCate = (value) => {
    this.data.cate = parseInt(value, 10);
    this.data.unit = this.table[this.l[this.data.cate]]? this.table[this.l[this.data.cate]][0]:'';
    this.data.res = 0;
    this.forceUpdate();
  }

  onChangeUnit = (value) => {
    this.data.unit = value;
  }

  onSave = () => {
    if (this.data.res < 0) return;
    if (this.props.onSave) {
      if (isNaN(this.data.res)) this.data.res = 0;
      this.props.onSave(this.data);
    }
  }

  render () {
    return (
      <Add className="add-life">
        <DayPickerInput 
          onDayChange={this.handleDayChange} 
          value={this.data.date} 
          dayPickerProps={{
            todayButton: 'Today',
          }}
        />
        <Select options={this.renderPara()} default={this.data.cate} onChange={this.onCate}/>
        <Input type="number" onBlur={this.onNumer} default={this.data.res} options={this.table[this.l[this.data.cate]]} onChangeUnit={this.onChangeUnit}/>
        <Save tag="保存" onClick={this.onSave}/>
      </Add>
    )
  }
}

// export default connect(state => state, actions)(AddTest);

