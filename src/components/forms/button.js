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

  const css = props.simple? 'from-button-simple': 'from-button-small';

  return (
    <a className={css} style={{width: props.width?props.width+'px': 'auto'}}
    onClick={onClick}>{text}</a>
  )
}
