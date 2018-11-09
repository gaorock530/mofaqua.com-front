import React from 'react';


/**
 * @param {Function} onClick return changed value
 * @param {String} text button text
 */

export default (props) => {
  const text = props.text || '确定';

  const onClick = (e) => {
    if (props.onClick) props.onClick(e);
  }

  return (
    <button 
    className="from-button"
    onClick={onClick}>{text}</button>
  )
}
