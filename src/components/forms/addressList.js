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
  }

  componentWillUpdate (props) {
    this.options = props.data || [];
  }

  flatAddr = (op) => {
    return op.cate.state + op.cate.city + op.cate.area + op.detail;
  }

  renderOps = () => {
    if (this.options instanceof Array && this.options.length > 0) {
      return this.options.map((op) => {
        let css = "fa " + (op.default? "fa-dot-circle": "fa-circle");
        return (
          <div key={op.id}> 
            <a className="form-radio-option" onClick={this.onClick.bind(this, op.id)}>
              <i className={css}></i>
              <span>{this.flatAddr(op)}</span>
              {op.default? (<span><i className="fa fa-caret-right"></i>默认地址</span>):''}
            </a>
            <i className="fa fa-times" onClick={this.onDel.bind(this, op.id)}></i>
          </div>
        ) 
      })
    } else {
      return '没有地址';
    }
  }

  onDel = (id) => {
    if (this.props.onDelete) {
      this.props.onDelete(id);
    }
    this.forceUpdate();
  }

  onClick = (id) => {
    if (this.props.onChange) {
      this.props.onChange(id);
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