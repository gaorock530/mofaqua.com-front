import React from 'react';
import cuid from 'cuid';

/**
 * @param {String} tag tag name of the label
 * @param {Array} options radio options {lable: '', value: ''}
 * @param {String/Number} default default value for check
 * @param {Function} onChange
 */

export default (props) => {
  const tag = props.tag || '';
  const options = props.options || [];
  const def = props.default === 'undefined' ? 1 : props.default;
  const name = cuid();
  console.log(def);

  const onChange = (e) => {
    if (props.onChange) {
      props.onChange(parseInt(e.currentTarget.value, 10));
    }
  }

  const renderOps = () => {
    if (options instanceof Array && options.length > 1) {
      return options.map(op => {
        return (
          <span className="option" key={cuid()}> 
            <input type="radio" name={name} value={op.value} onChange={onChange} defaultChecked={def === op.value}/>
            <label>{op.label}</label>
          </span>
        )
      })
    } else {
      return '';
    }
  }

  return (
    <div className="forms-inputs">
      {tag?<label className="tag-name">{tag}</label>:''}
      {renderOps()}
    </div>
  )
}