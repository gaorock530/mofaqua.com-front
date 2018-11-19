import React, {PureComponent} from 'react';


/**
 * @param {String} label label text
 * @param {Function} onChange return changed value
 * @param {String} on on state text
 * @param {String} off off state text
 * @param {Boolean} default default value
 */

export default class Swicth extends PureComponent {
  constructor (props) {
    super(props);
    this.label = this.props.label || null;
    this.switch = typeof this.props.default === "boolean"?this.props.default: true;
  }

  onclick = () => {
    this.refs.switch.classList.toggle('move');
    this.switch = !this.switch;
    if (this.props.onChange) {
      this.props.onChange(this.switch);
    }
  }

  render () {
    return (
      <div className="form-switch">
        {this.label?<div ref="label" className="form-switch-label">
          {this.label}
        </div>:''}
        <div className="form-switch-button" onClick={this.onclick}>
          <div className={this.switch?'wapper':'wapper move'} ref="switch">
            <span className="on">{this.props.on || '是'}</span>
            <span className="block">&nbsp;</span>
            <span className="off">{this.props.off || '否'}</span>
          </div>
        </div>
      </div>
    )
  }
}


