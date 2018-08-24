import React, {PureComponent} from 'react';


/**
 * @param {Function} onChange return changed value
 * @param {String} on on state text
 * @param {String} off off state text
 * @param {Boolean} default default value
 */

export default class Swicth extends PureComponent {
  constructor (props) {
    super(props);
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
      <div className="switch" onClick={this.onclick}>
        <div className={this.switch?'wapper':'wapper move'} ref="switch">
          <span className="on">{this.props.on || 'on'}</span>
          <span className="block">&nbsp;</span>
          <span className="off">{this.props.off || 'off'}</span>
        </div>
      </div>
    )
  }
  
}


