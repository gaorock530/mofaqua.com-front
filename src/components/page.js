import React from 'react';

export default (props) => {
  return (
    <div>
      <section className="header-mask"></section> 
      {
        props.wapper?<section className="channel-wrapper">{props.children}</section>:
        props.children
      }
      
    </div>
  )
}
