import React, { PureComponent } from 'react';
import cuid from 'cuid';

/**
 * @param {String} type input types /text/number/password
 * @param {String} tag label text
 * @param {String} placeholder
 * @param {Array} options post tag switchable
 * @param {Function} onBlur
 * @param {Function} onKeyPress
 * @param {Function} onChange
 * @param {Function} onChangeUnit
 */

export default class Input extends PureComponent {
  constructor (props) {
    super(props);
    this.type = this.props.type || 'text';
    this.tag = this.props.tag;
    this.placeholder = this.props.placeholder || '';
    this.options = this.props.options;
  }

  componentDidMount () {
    this.refs.text.value = typeof this.props.default === 'undefined'?'':this.props.default;
  }

  componentWillUpdate (props) {
    this.options = props.options;
    if (props.default) {
      this.refs.text.value = props.default;
    }
  }

  renderOps = () => {
    if (this.options instanceof Array && this.options.length !==0) {
      if (this.options.length === 1) {
        return <span className="post-tag">{this.options[0]}</span>
      } else {
        return (
          <select className="post-tag-select" onChange={this.onChangeUnit} value={this.props.defaultOp || 0}>
            {this.options.map((op, index) => {
              return <option key={cuid()} value={index}>{op}</option>
            })}
          </select>
        )
      }
    } else {
      return '';
    }
  }

  onBlur = () => {
    if (this.props.onBlur) {
      const value = this.type === 'number'?parseFloat(this.refs.text.value):this.refs.text.value;
      this.props.onBlur(value, ...arguments);
    }
  }
  onKeyPress = () => {
    if (this.props.onKeyPress) {
      this.props.onKeyPress(this.refs.text.value, ...arguments);
    }
  }
  onChange = () => {
    if (this.props.onChange) {
      this.props.onChange(this.refs.text.value, ...arguments);
    }
  }
  onChangeUnit = (e) => {
    if (this.props.onChangeUnit) {
      this.props.onChangeUnit(parseInt(e.target.value, 10), ...arguments);
    }
  }

  render () {
    return (
      <div className="forms-inputs">
        {this.tag?<label className="tag-name">{this.tag}</label>:''}
        {!this.options? 
          <input className="fullwidth" type={this.type} placeholder={this.placeholder} ref="text" 
          onBlur={this.onBlur}
          onKeyPress={this.onKeyPress}
          onChange={this.onChange}/>:
          <div className="input-wapper">
            <input type={this.type} placeholder={this.placeholder} ref="text" 
            onBlur={this.onBlur}
            onKeyPress={this.onKeyPress}
            onChange={this.onChange}
            />
            {this.renderOps()}
          </div>
        }
      </div>
    )
  }
}