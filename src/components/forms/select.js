import React, { Component } from 'react';
import cuid from 'cuid';

/**
 * @param {String} tag tag name of the label
 * @param {Array} options radio options
 * @param {String} className
 * @param {Index} default default index for a value
 */

export default class Select extends Component {
  constructor (props) {
    super(props);
    this.tag = this.props.tag || '';
    this.options = this.props.options || [];
  }

  componentWillReceiveProps (props) {
    this.options = props.options || [];
  }

  onChange = () => {
    if (this.props.onChange) {
      this.props.onChange(parseInt(this.refs.select.value, 10), ...arguments);
    }
  }

  renderOps = () => {
    if (this.options instanceof Array && this.options.length >= 1) {
      return this.options.map(op => {
        return (
          <option key={cuid()} value={op.value}>{op.label}</option>
        )
      })
    } else if (this.props.week === true) {
      const days = ['一', '二', '三', '四', '五', '六', '日'];
      let c = -1;
      return days.map((day) => {
        c++;
        return <option key={c} value={c}>{'周'+day}</option>;
      })
    } else if (this.props.month === true) {
      const p = [];
      for(let i=0;i<30;i++) {
        p.push(<option key={i} value={i}>{i+1}</option>);
      }
      return p;
    } else if (this.props.round === true) {
      const p = [];
      for(let i=0;i<12;i++) {
        p.push(<option key={i} value={i}>{i+1}</option>);
      }
      return p;
    } else {
      return '';
    }
  }

  render () {
    return (
      <div className={`forms-inputs ${this.props.className || ''}`}>
        {this.tag?<label className="tag-name">{this.tag}</label>:''}
        <select className="select" ref="select" value={this.props.default || 0} onChange={this.onChange}>
          {this.renderOps()}
        </select>
      </div>
    )
  }
}