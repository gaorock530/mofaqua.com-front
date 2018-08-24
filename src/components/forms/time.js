import React from 'react';

/**
 * @param {String} tag tag name of the label
 */

export default (props) => {
  const tag = props.tag || '';
  const time= {
    h: 0,
    m: 0
  }

  const onChangeH = (e) => {
    time.h = parseInt(e.target.value, 10);
    if (props.onChange) {
      props.onChange(time);
    }
  }

  const onChangeM = (e) => {
    time.m = parseInt(e.target.value, 10);
    if (props.onChange) {
      props.onChange(time);
    }
  }

  const renderHour = () => {
    const time = [];
    for (let i=0;i<24;i++) {
      time.push(<option key={i} value={i}>{i}</option>);
    }
    return time;
  }

  const renderMinite = () => {
    const time = [];
    for (let i=0;i<60;i+=5) {
      time.push(<option key={i} value={i}>{i}</option>);
    }
    return time;
  }

  return (
    <div className="forms-inputs">
      {tag?<label className="tag-name">{tag}</label>:''}
      <div className="time">
        <select className="time-select" onChange={onChangeH}>
          {renderHour()} 
        </select>
        <span className="time-tag">时</span>
        <select className="time-select" onChange={onChangeM}>
          {renderMinite()}
        </select> 
        <span className="time-tag">分</span>
      </div>
    </div>
  )
}


