import React, { Component } from 'react';

export default (props) => {
  return (
    <div className="error-text">
      {props.children}
    </div>
  )
}