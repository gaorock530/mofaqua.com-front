import React, {PureComponent} from 'react';
import Input from './input';


/**
 * @param {String} label label text
 * @param {Function} onChange return changed value
 * @param {String} on on state text
 * @param {String} off off state text
 * @param {Boolean} default default value
 */

export default class Tag extends PureComponent {
  constructor (props) {
    super(props);
    this.label = this.props.label || null;
  
  }

  render () {
    return (
      <Input />
    )
  }
}


