import React from 'react';

/**
 * @param {String} position ['top', 'mid', 'bot']
 * @param {String} Stype [style1, style2, ...]
 * @param {String} size '20px'
 * @param {Boolean} single false
 * @param {Elements} children <div>some elements</div>
*/

export default (props) => {
  const { 
    position = '',
    Stype = 'style1', 
    size = "50px" ,
    single = true,
    padding = false,
  } = props;

  return (
    <div className={'spinnner-wapper ' + position} style={{'position': single?'absolute':'relative', 'padding': padding?padding:0}}>
      <div className={"spinner " + Stype} style={{width: size, height: size}}>
        {props.children}
      </div>
    </div>
  )
}