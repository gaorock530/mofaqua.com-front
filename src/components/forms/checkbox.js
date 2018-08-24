import React from 'react';
import cuid from 'cuid';

/**
 * @param {String} tag tag name of the label
 * @param {Array} options checkbox options 
 */

export default (props) => {

  const tag = props.tag || '';
  const options = props.options || [];


  const onChange = (e) => {
    const ops = options.map(op => {
      if (op.value.toString() === e.currentTarget.value){
        op.checked = e.currentTarget.checked
      }
      return op;
    })

    if (props.onChange) {
      props.onChange(ops);
    }
  }

  const renderOps = () => {
    if (options instanceof Array && options.length > 1) {
      return options.map(op => {
        return (
          <span className="option" key={cuid()}> 
            <label>{op.label}</label>
            <input type="checkbox" name="box" ref="box" value={op.value} onChange={onChange} defaultChecked={op.checked}/>
          </span>
        )
      })
    } else {
      return '';
    }
  }


  return (
    <div className="forms-inputs">
      <label className="tag-name">{tag}</label>
      {renderOps()}
    </div>
  )

}