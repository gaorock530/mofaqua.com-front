import React from 'react';
import word from '../../helper/wordcounter';


/**
 * @param {String} default default text
 * @param {String} className
 * @param {Function} onBlur return text
 * @param {Function} onChange return wordcount
 * @param {String} placeholder
 */

export default (props) => {
  const onBlur = (e) => {
    if (props.onBlur) {
      props.onBlur(e.target.value);
    }
  }
  
  const onChange = (e) => {
    if (props.onChange) {
      props.onChange(word(e.target.value, true, true));
    }
  }

  return (
    <div className="forms-inputs">
      {props.tag?<label className="tag-name">{props.tag}</label>:''}
      <textarea 
        onBlur={onBlur} 
        onChange={onChange} 
        className={`textarea ${props.className || ''}`} 
        defaultValue={props.default || ''} 
        placeholder={props.placeholder || ''}
      ></textarea>
    </div>
  )
}