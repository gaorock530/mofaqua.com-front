import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import * as actions from '../redux/actions';

class Note extends PureComponent {
  componentDidMount () {
    this.refs.show.addEventListener('mouseover', () => {
      this.props.set_note('123');
      console.log('hover');
    })
    this.refs.show.addEventListener('mouseout', () => {
      this.props.set_note();
      console.log('out');
    })

    console.log(this.props.children[0]);
  }
  render () {
    return (
      <div className="note">
        <div ref="show">
          {this.props.children}
        </div>
        <span className="tag">
          {this.props.page.note || ''}
        </span>
      </div>
    )
  }
}


export default connect(null, actions)(Note);
