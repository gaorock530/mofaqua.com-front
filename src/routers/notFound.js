import React from 'react';
import ADs from '../components/ads';

export default () => {
  return (
    <div>
      <section className="header-mask"></section> 
      <section className="notfound">
        <p>网页走丢了</p>
        <ADs>Some ADs</ADs>
      </section>
    </div>
  )
};