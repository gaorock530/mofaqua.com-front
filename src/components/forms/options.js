import React, {PureComponent} from 'react';
import Radio from './radio';

export default class Options extends PureComponent {
  constructor (props) {
    super(props);
    this.data = this.props.data || [];
  }

  renderList () {
    return this.data.map((op) => {
      return (
        <div>
          <Radio />
        </div>
      )
    })
  }

  render () {
    return (
      <div>
        {this.renderList()}
      </div>
    )
  }
}