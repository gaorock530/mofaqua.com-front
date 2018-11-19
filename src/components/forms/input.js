import React, {PureComponent} from 'react';

/**
 * @param {String} label whether to display label on top of input
 * @param {Color} labelColor label font color
 * @param {Function} condition regular expression for pass conditions
 * @param {String} errorText text to display when error occurs
 * @param {Boolean} strictError if 'strictError' is set to True, errorText must be displayed
 * @param {Color} bgColor background color
 * @param {Type} type input type
 * @param {String} placeholder
 * @param {String|Array|{icon: '', toggle: ''}} tag input tag, 
 * if {toggle: 'className'} provide, AND only for 'password' input
 * input box will toggle between 'password' and 'text'
 * @param {Function} onBlur reture input value to outter component
 * @param {Function} onChangeUnit
 * @param {Function} onChange
 * @param {String} defaultValue input default value
 * @param {String} defaultOp default tag option
 * @param {Number} width custom input width
 * @param {Boolean} force !important!!!!!!! fix componentWillUpdate problem
 */

export default class Input extends PureComponent {
  constructor (props) {
    super(props);
    // internal properties
    this.width = this.props.width || null;
    this.isEmpty = true;
    this.valid = true;
    this.input = this.props.defaultValue || '';
    this.timer = null;
    this.tagOp = this.props.defaultOp || 0;
    // custom properties
    this.bgColor = this.props.bgColor || null;
    this.label = this.props.label || null;
    this.condition = this.props.condition || null;
    this.errorText = this.props.errorText || null;
    // if 'strictError' is set to True, errorText must be displayed
    this.strictError = this.props.strictError; // true-show,false-off
    this.labelColor = this.props.labelColor || null;
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

  componentWillUpdate (props) {
    if (this.props.force) {
      if (props.type) this.type = props.type;
      if (props.placeholder) this.placeholder = props.placeholder;
      if (props.label) this.label = props.label;
    }
    
    if (this.input && typeof props.strictError !== 'undefined') {
      console.log('strictError', props.strictError);
      this.strictError = props.strictError;
      props.strictError? this.error():this.normal();
    }

  }

  onFocus = () => {
    this.refs.form_input_container.classList.add('form-input-container-focus');
  }

  onBlur = (e) => {
    this.refs.form_input_container.classList.remove('form-input-container-focus');
    if (this.props.onBlur) this.props.onBlur(e.target.value, this.tagOp, this.valid);
  }

  onChange = (e) => {
    this.input = e.target.value;
    
    clearTimeout(this.timer);
    if (e.target.value === '') {
      this.isEmpty = true;
    } else {
      this.isEmpty = false;
    }
    
    if (this.condition !== null && this.errorText !== null) {
      this.valid = false;
      this.timer = setTimeout(this.check.bind(this, e.target.value), 1000);
    }
    if (this.props.onChange) this.props.onChange(e.target.value, this.tagOp, this.valid);
  }

  check = async (value) => {
    this.normal();
    if (!this.isEmpty) {
      const res = await this.condition(value);
      if (res) {
        this.valid = true;
        this.pass();
      } else {
        // this.errorText = this.props.errorText;
        this.error();
      }
    }
    if (this.props.onChange) this.props.onChange(value, this.tagOp, this.valid);
    this.forceUpdate();    
  }

  normal = () => {
    this.refs.form_input_container.classList.remove('form-input-pass');
    this.refs.form_input_container.classList.remove('form-input-status-pass');
    this.refs.input_status.classList.remove('form-input-pass');
    this.refs.input_status.classList.remove('form-input-status-pass');
    this.refs.form_input_container.classList.remove('form-input-error');
    this.refs.form_input_container.classList.remove('form-input-status-error');
    this.refs.input_status.classList.remove('form-input-error');
    this.refs.input_status.classList.remove('form-input-status-error');
  }

  pass = () => {
    this.refs.form_input_container.classList.add('form-input-pass');
    this.refs.input_status.classList.add('form-input-status-pass');
  }

  error = () => {
    this.refs.form_input_container.classList.add('form-input-error');
    this.refs.input_status.classList.add('form-input-status-error');
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

  onTagClick = (e) => {
    if (this.tag.toggle) {
      if (e.target.classList.contains('fa-' + this.tag.icon)) {
        e.target.classList.replace('fa-' + this.tag.icon, 'fa-' + this.tag.toggle);
        this.type = 'text';
      } else {
        e.target.classList.replace('fa-' + this.tag.toggle, 'fa-' + this.tag.icon);
        this.type = 'password';
      }
      this.forceUpdate();
    }

    this.refs.input_area.focus();
  }

  render () {
    const css = this.width? 'form-element-custom': 'form-element';
    return (
      <div className={css} style={this.width?{width: this.width}:null}>
        {this.label? 
        <div ref="label" className="form-input-label">
          <h5 style={this.labelColor?{'color': this.labelColor}:null}>{this.label}</h5>
        </div>:''}

        <div ref="form_input_container" 
          className="form-input" 
          style={this.bgColor?{'backgroundColor': this.bgColor}:{}}
        >
          <div className={this.tag?"form-input-main-withtag":"form-input-main"}>
            <div ref="input_status" className="form-input-status"></div>
            <input ref="input_area" className="form-input-area" type={this.type}
            autoComplete="off"
            placeholder={this.placeholder}
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            onChange={this.onChange}
            />
          </div>
          {this.renderTag()}
        </div>
        {this.input && this.errorText && (!this.valid || this.strictError)?<div className="form-input-error-box">{this.errorText}</div> :''}
      </div>
    )
  }
}