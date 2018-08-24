import React from 'react';


/**
 * @param {String} text default text
 */

export default (props) => {
  return (
    <div className="forms-inputs">
      <div className="warning-icon">
        <i className="fa fa-exclamation-circle red"></i>
        <div>{props.text || ''}</div>
      </div>
    </div>
  )
}