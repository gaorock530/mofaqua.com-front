import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import * as actions from '../redux/actions';
import { Scrollbars } from 'react-custom-scrollbars';

class Add extends PureComponent {
  render () {
    const className = this.props.className? `form ${this.props.className}`:'form';
    return (
      <div className="upfront">
        <div onClick={this.props.set_edit_page.bind(this, null)} className="cover"></div>
        <div className={className}>
          <a onClick={this.props.set_edit_page.bind(this, null)} className="close"><i className="fa fa-times"></i></a>
          <Scrollbars className="body">{this.props.children}</Scrollbars>
        </div>
      </div>
    )
  }
}

export default connect(null, actions)(Add);