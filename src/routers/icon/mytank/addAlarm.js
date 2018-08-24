import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../../redux/actions';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import Add from '../../../components/add';
import Input from '../../../components/forms/input';
import Switch from '../../../components/forms/switch';
import Select from '../../../components/forms/select';
import Save from '../../../components/forms/save';
import Time from '../../../components/forms/time';

/**
 * @param {Function} onSave fires when click save
 */

class Addalarm extends PureComponent {
  constructor (props) {
    super(props);
    this.data = {
      name: '',
      week: 1,
      weeks: 1,
      day: 1,
      repeat: true,
      freq: 2,
      time: 0,
      date: new Date(Date.now())
    };
    this.options = [
      {
        label: '每天',
        value: 1
      },
      {
        label: '每周',
        value: 2
      },
      {
        label: '每隔几天',
        value: 3
      }
      ,
      {
        label: '每隔几个月',
        value: 4
      }
    ]
  }
  componentWillMount () {
    this.props.change_form_data('repeat', 1);
    this.props.change_form_data('freq', 2);
  }

  onInput = (text) => {
    this.data.name = text.trim();
  }

  onTime = (time) => {
    console.log(time);
    this.data.time = time;
  }

  repeat = (value) => {
    this.data.repeat = value;
    this.props.change_form_data('repeat', value);
  }
  changeFreq = (value) => {
    this.data.freq = value;
    this.props.change_form_data('freq', value);
  }
  changeWeek = (value) => {
    this.data.week = value;
    this.props.change_form_data('week', value);
  }
  changeDay = (value) => {
    this.data.day = value;
    this.props.change_form_data('day', value);
  }
  changeRound = (value) => {
    this.data.round = value;
    this.props.change_form_data('round', value);
  }
  

  renderFreq = () => {
    switch (this.props.form.freq) {
      case 2:
        return <Select week={true} default={this.props.form.week} onChange={this.changeWeek}/>
      case 3:
        return <Select month={true} default={this.props.form.day} onChange={this.changeDay} />
      case 4:
        return <Select round={true} default={this.props.form.round} onChange={this.changeRound} />
      default:
        return ''
    }
  } 

  handleDayChange = (date) => {
    this.data.date = date;
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
      <Add className="add-alarm">
        <Switch onChange={this.repeat} on="重复" off="仅一次"/>
        {this.props.form.repeat?<Select tag="周期" options={this.options} default={this.props.form.freq} onChange={this.changeFreq}/>:''}
        {this.props.form.repeat?this.renderFreq():''}
        {!this.props.form.repeat? (
          <div style={{'paddingTop': '10px'}}>
            <label className="label-name">日期</label>
            <DayPickerInput 
            onDayChange={this.handleDayChange} value={this.data.date}/>
          </div>
        ):''}
        <Time onChange={this.onTime}/>
        <Input tag="提醒内容" onBlur={this.onInput}/>
        <Save tag="保存" onClick={this.onSave}/>
      </Add>
    )
  }
  
}

export default connect(state => state, actions)(Addalarm);

