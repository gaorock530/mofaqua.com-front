import React from 'react';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import Add from '../../../components/add';
import Input from '../../../components/forms/input';
import Save from '../../../components/forms/save';


/**
 * @param {Function} onSave fires when click save
 */

export default (props) => {
  const data = {
    note: '',
    date: new Date(Date.now())
  };

  const onSave = () => {
    if (data.note === '' || data.date === null) return;
    if (props.onSave) {
      props.onSave(data);
    }
  }
  const onInput = (text) => {
    data.note = text.trim();
  }

  const handleDayChange = (date) => {
    console.log(new Date(date));
    data.date = date;
  }

  return (
    <Add className="add-alarm">
      <label className="label-name">日期</label>
      <DayPickerInput dayPickerProps={{
            todayButton: 'Today',
          }} onDayChange={handleDayChange} value={data.date}
      />
      <Input tag="笔记" onBlur={onInput}/>
      <Save tag="保存" onClick={onSave}/>
    </Add>
  )
}


