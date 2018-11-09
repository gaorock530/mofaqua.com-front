import React, {PureComponent} from 'react';

/**
 * @param {String} tag tag name of the label
 * @param {Array} options radio options {lable: '', value: ''}
 * @param {String/Number} default default value for check
 * @param {Function} onChange
 */

export default class Radio extends PureComponent {
  constructor (props) {
    super(props);
    this.tag = this.props.tag || null;
    this.options = this.props.data || [];
    this.def = this.props.default || 0;
  }

  renderOps = () => {
    if (this.options instanceof Array && this.options.length > 0) {
      return this.options.map((op, index) => {
        let deft = this.def === index;
        let css = "fa " + (deft? "fa-dot-circle": "fa-circle");
        return (
          <div key={index}> 
            <a className="form-radio-option" onClick={this.onClick.bind(this, index)}>
              <i className={css}></i>
              <span>{op}</span>
              {deft? (<span><i className="fa fa-caret-right"></i>默认地址</span>):''}
            </a>
            <i className="fa fa-times" onClick={this.onDel.bind(this, index)}></i>
          </div>
        )
      })
    } else {
      return '没有地址';
    }
  }

  onDel = (index) => {
    this.options.splice(index, 1);
    this.def = 0;
    if (this.props.onChange) {
      this.props.onChange(this.def);
    }
    this.forceUpdate();
  }

  onClick = (index) => {
    if (this.stop) return;
    this.def = index;
    if (this.props.onChange) {
      this.props.onChange(this.def);
    }
    this.forceUpdate();
  }

  render () {
    return (
      <div className="form-radio">
        {this.tag?<label className="tag-name">{this.tag}</label>:''}
        {this.renderOps()}
      </div>
    )
  }
  
}