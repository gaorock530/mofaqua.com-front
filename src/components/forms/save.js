import React from 'react';

/**
 * @param {String} tag tag name of the label
 * @param {Boolean} red color of the button
 */

export default (props) => {
  const tag = props.tag || '';

  const onClick = () => {
    if (props.onClick) {
      props.onClick();
    }
  }
  return (
    <div className="center forms-inputs">
      <button onClick={onClick} className={`form-button ${props.red?'warning':'normal'}`}>{tag}</button>
    </div>
  )

}
