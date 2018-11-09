import React, { PureComponent } from 'react';

/**
 * @param {String} label 
 * @param {String} default default text
 * @param {String} placeholder
 * @param {Function} onChange
 * @param {Function} onBlur
 * @param {Number|String} max 
 * @param {Number|String} min
 */

export default class Textarea extends PureComponent {
  constructor (props) {
    super(props);
    this.label = this.props.label || null;
    this.default = this.props.default || '';
    this.placeholder = this.props.placeholder || null;
    this.length = this.default.length;
    this.max = parseInt(this.props.max, 10) || 0;
    this.min = parseInt(this.props.min, 10) || 0;
  }

  onChange = (e) => {
    if (this.max || this.min) {
      this.length = e.target.value.length;
      if (this.length > this.max) {
        this.refs.word.classList.add('text-length-over');
        this.refs.textarea.classList.add('form-input-error');
      }else {
        this.refs.word.classList.remove('text-length-over');
        this.refs.textarea.classList.remove('form-input-error');
      }
      this.forceUpdate();
    }
    if (this.props.onChange) this.props.onChange(e.target.value);
  }

  onBlur = (e) => {
    const exceed = this.length - this.max;
    if (this.props.onBlur) this.props.onBlur(e.target.value, exceed <=0? undefined: exceed);
  }
  
  render () {
    return (
      <div className="form-element">
        {this.label? 
        <div className="form-input-label">
          <h5>{this.label}
            {this.max?
            <span className="form-word-count">
              <span ref="word">{this.length}</span>
              <span>/{this.max}</span>
            </span>
            
            :''}
          </h5>
        </div>:''}
        <textarea className="form-textarea"
          ref="textarea"
          placeholder={this.placeholder}
          defaultValue={this.default}
          onChange={this.onChange}
          onBlur={this.onBlur}
        ></textarea>
      </div>
    )
  }
}