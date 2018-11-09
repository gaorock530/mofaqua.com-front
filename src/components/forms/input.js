import React, {PureComponent} from 'react';

/**
 * @param {String} label whether to display label on top of input
 * @param {Function} condition regular expression for pass conditions
 * @param {String} errorText text to display when error occurs
 * @param {Color} labelColor label font color
 * @param {Color} bgColor background color
 * @param {Type} type input type
 * @param {String} placeholder
 * @param {String|Array|Object{icon: ''}} tag input tag 
 * @param {Function} onBlur reture input value to outter component
 * @param {Function} onChangeUnit
 * @param {String} defaultValue input default value
 * @param {String} defaultOp default tag option
 * @param {Number} width custom input width
 */

export default class Input extends PureComponent {
  constructor (props) {
    super(props);
    // internal properties
    this.width = this.props.width || null;
    this.isEmpty = true;
    this.status = 0;
    this.input = this.props.defaultValue || '';
    this.timer = null;
    this.tagOp = this.props.defaultOp || 0;
    // custom properties
    this.bgColor = this.props.bgColor || null;
    this.label = this.props.label || null;
    this.condition = this.props.condition || null;
    this.errorText = this.props.errorText || null;
    this.labelColor = this.props.labelColor;
    this.type = this.props.type || 'text';
    this.placeholder = this.props.placeholder || '';
    this.tag = this.props.tag || null;
    // this.defaultOp = this.props.defaultOp || 0;
  }
  componentDidMount () {
    if (this.input) this.refs.input_area.value = this.input;
  }
  componentWillUnmount () {
    clearTimeout(this.timer);
  }

  onFocus = () => {
    this.refs.form_input_container.classList.add('form-input-container-focus');
  }

  onBlur = (e) => {
    this.refs.form_input_container.classList.remove('form-input-container-focus');
    if (this.props.onBlur) this.props.onBlur(e.target.value, this.tagOp, this.status === 2? true: false);
  }

  onChange = (e) => {
    clearTimeout(this.timer);
    if (e.target.value === '') {
      this.isEmpty = true;
    } else {
      this.isEmpty = false;
    }
    this.input = e.target.value;
    if (this.condition !== null && this.errorText !== null) {
      this.timer = setTimeout(this.check.bind(this, e.target.value), 1000);
    }
  }

  check = (value) => {
    this.refs.form_input_container.classList.remove('form-input-pass');
    this.refs.form_input_container.classList.remove('form-input-status-pass');
    this.refs.input_status.classList.remove('form-input-pass');
    this.refs.input_status.classList.remove('form-input-status-pass');
    this.refs.form_input_container.classList.remove('form-input-error');
    this.refs.form_input_container.classList.remove('form-input-status-error');
    this.refs.input_status.classList.remove('form-input-error');
    this.refs.input_status.classList.remove('form-input-status-error');
    if (this.isEmpty) {
      this.status = 0;
    } else {
      if (this.condition(value)) {
        this.status = 2;
        if (this.props.onBlur) this.props.onBlur(value, this.tagOp, true);
        this.refs.form_input_container.classList.add('form-input-pass');
        this.refs.input_status.classList.add('form-input-status-pass');
      } else {
        this.status = 1;
        this.errorText = this.props.errorText;
        this.refs.form_input_container.classList.add('form-input-error');
        this.refs.input_status.classList.add('form-input-status-error');
      }
    }
    this.forceUpdate();
  }

  renderTag = () => {
    if (this.tag) {
      return (
        <div className="form-input-tag">
          {typeof this.tag === 'string'?<div className="form-input-tag-text" onClick={this.onTagClick}>{this.tag}</div>:
          this.tag instanceof Array?
          <select className="form-input-tag-option" 
          onChange={this.onChangeTag} value={this.props.defaultOp || 0}>
            {this.renderTagOption()}
          </select>:this.tag.icon?<i onClick={this.onTagClick} className={"form-input-tag-icon fas fa-"+this.tag.icon}></i>:''
          }
        </div>
      )
    }
  }

  renderTagOption = () => {
    return this.tag.map((op, index) => {
      return <option value={index} key={index}>{op}</option>
    })
  }

  onChangeTag = (e) => {
    this.tagOp = e.target.value;
    this.refs.input_area.focus();
    if (this.props.onChangeUnit) this.props.onChangeUnit(parseInt(e.target.value, 10));
  }

  onTagClick = () => {
    this.refs.input_area.focus();
  }

  render () {
    const css = this.width? 'form-element-custom': 'form-element';
    return (
      <div className={css} style={this.width?{width: this.width+'px'}:null}>
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
            <input ref="input_area" className="form-input-area" type={this.type}
            placeholder={this.placeholder}
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            onChange={this.onChange}
            />
          </div>
          {this.renderTag()}
        </div>
        {this.errorText && this.status === 1?<div className="form-input-error-box">{this.errorText}</div> :''}
      </div>
    )
  }
}