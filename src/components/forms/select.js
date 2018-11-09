import React, {PureComponent} from 'react';

/**
 * @param {String} label whether to display label on top of input
 * @param {Function} condition regular expression for pass conditions
 * @param {String} errorText text to display when error occurs
 * @param {Color} labelColor label font color
 * @param {Color} bgColor background color
 * @param {Function} onBlur reture input value to outter component
 * @param {Array} options array of options to display
 * @param {Number} default default value on select
 * @param {String} firstOp a name of empty value as first option
 */

export default class Select extends PureComponent {
  constructor (props) {
    super(props);
    // internal properties
    this.isEmpty = true;
    this.status = 0;
    this.input = '';
    this.timer = null;
    // custom properties
    this.label = this.props.label || null;
    this.condition = this.props.condition || null;
    this.errorText = this.props.errorText || null;
    this.labelColor = this.props.labelColor;
    this.options = this.props.options || [];
    this.default = this.props.default || 0;
    this.firstOp = this.props.firstOp || null;
  }

  componentWillUpdate (props) {
    this.options = props.options || [];
    this.default = props.default || 0;
  }

  changeStyle = (e) => {
    if (this.condition && this.errorText) {
      this.refs.form_input_container.classList.remove('form-input-pass');
      this.refs.form_input_container.classList.remove('form-input-status-pass');
      this.refs.input_status.classList.remove('form-input-pass');
      this.refs.input_status.classList.remove('form-input-status-pass');
      this.refs.form_input_container.classList.remove('form-input-error');
      this.refs.form_input_container.classList.remove('form-input-status-error');
      this.refs.input_status.classList.remove('form-input-error');
      this.refs.input_status.classList.remove('form-input-status-error');
      if (this.condition(e.target.value)) {
        this.status = 2;
        this.refs.form_input_container.classList.add('form-input-pass');
        this.refs.input_status.classList.add('form-input-status-pass');
      } else {
        this.status = 1;
        this.refs.form_input_container.classList.add('form-input-error');
        this.refs.input_status.classList.add('form-input-status-error');
      }
      this.forceUpdate();
    }
  }

  onChange = (e) => {
    this.changeStyle(e);
    if (this.props.onChange) this.props.onChange(parseInt(e.target.value, 10));
  }

  onFocus = () => {
    this.refs.form_input_container.classList.add('form-input-container-focus');
  }

  onBlur = (e) => {
    this.changeStyle(e);
    this.refs.form_input_container.classList.remove('form-input-container-focus');
    if (this.props.onBlur) this.props.onBlur(parseInt(e.target.value, 10));
  }

  renderOptions = () => {
    return this.options.map((op, index )=> {
      return <option value={this.firstOp?index+1:index} key={index}>{op}</option>
    });
  }

  render () {
    return (
      <div className="form-element">
        {this.label? 
        <div ref="label" className="form-input-label">
          <h5>{this.label}</h5>
        </div>:''}
        <div ref="form_input_container"
            className="form-input" 
            style={this.bgColor?{'backgroundColor': this.bgColor}:{}}
          >
          <div className={this.tag?"form-input-main-withtag":"form-input-main"}>
            <div ref="input_status" className="form-input-status"></div>
            <select ref="input_area" className="form-select-area"
              value = {this.default}
              onFocus={this.onFocus}
              onBlur={this.onBlur}
              onChange={this.onChange}
            >
              {this.firstOp?<option value={0}>{this.firstOp}</option>:''}
              {this.renderOptions()}
            </select>
            <div className="form-select-arrow">
              <i className="fas fa-angle-up form-select-arrow-up"></i>
              <i className="fas fa-angle-down form-select-arrow-down"></i>
            </div>
          </div>
        </div>
        {this.errorText && this.status === 1?<div className="form-input-error-box">{this.errorText}</div> :''}
      </div>
    )
  }
}