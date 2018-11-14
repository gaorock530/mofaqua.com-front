import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import * as actions from '../../redux/actions';

class Expend extends PureComponent {
  componentDidMount () {
    if (this.props.open) this.props.open();
    this.refs.expend.addEventListener('mouseenter', this.on);
    this.refs.expend.addEventListener('mouseleave', this.off);
    document.addEventListener('click', this.check);
  }
  componentWillUnmount () {
    if (this.props.close) this.props.close();
    this.refs.expend.removeEventListener('mouseenter', this.on);
    this.refs.expend.removeEventListener('mouseleave', this.off);
    document.removeEventListener('click', this.check);
  }

  check = () => {
    if (!this.over && this.props.page.expendActive) this.props.set_expend_active();
  }

  on = () => this.over = true;
  off = () => this.over = false;

  render() {
    return (
      <div ref="expend" className="menu-expend noselect">
        {this.props.children}
      </div>
    );
  }
}


export default connect(({page}) => ({page}), actions)(Expend);