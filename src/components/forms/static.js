import React from 'react';


/**
 * @param {String} text default text
 * @param {String} label 
 */

export default (props) => {
  return (
    <div className="form-element">
      {props.label? 
      <div className="form-input-label">
        <h5>{props.label}</h5>
      </div>:''}
      <div
          className="form-input" 
          style={this.bgColor?{'backgroundColor': this.bgColor}:{}}
        >
        <div className={this.tag?"form-input-main-withtag":"form-input-main"}>
          <div className="form-input-area"><span className="v-center">{props.text || ''}</span></div>
        </div>
      </div>
    </div>
  )
} 