import React from 'react';


/**
 * @param {String} text default text
 * @param {String} tag 
 */

export default (props) => {
  return (
    <div className="forms-inputs">
      {props.tag?<label className="tag-name">{props.tag}</label>:''}
      <div className="static fullwidth">{props.text || ''}</div>
    </div>
  )
}