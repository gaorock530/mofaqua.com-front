import React from 'react';

export default () => {
  const toTop = () => {
    window.scrollBy(0, -window.scrollY);
  }


  return (
    <div className="top noselect" onClick={toTop}>
      <a><i className="fa fa-chevron-up"></i></a>
    </div>
  )

}
