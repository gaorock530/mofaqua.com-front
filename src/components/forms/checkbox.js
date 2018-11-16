import React, {PureComponent} from 'react';
// import cuid from 'cuid';

/**
 * @param {String} tag tag name of the label
 * @param {String|Array} options checkbox options or Single value
 * @param {Function} onChange
 */

export default class CheckBox extends PureComponent {
  constructor (props) {
    super(props);
    this.tag = this.props.tag || '';
    this.options = this.props.options && typeof this.props.options === 'string'? [{c: false, v: this.props.options}]: this.props.options;
    this.single = this.options && typeof this.props.options === 'string';
  }

  toggle = (index) => {
    this.options[index].c = !this.options[index].c;
    if (this.props.onChange) this.props.onChange(this.options);
    this.forceUpdate();
  }

  renderOps = () => {
    if (this.options) {
      return this.options.map((op, index) => {
        return (
          <label className={this.single?"form-single-option":"form-radio-option"} key={index}
          onClick={this.toggle.bind(this, index)}> 
            <i className={'fa fa-' + (op.c?'check-square': 'square')}></i>
            <span>{op.v}</span>
          </label>
        )
      })
    } 
    return '';
  }

  render () {
    return (
      <div className="forms-inputs">
        <label className="tag-name">{this.tag}</label>
        {this.renderOps()}
      </div>
    )
  }
}