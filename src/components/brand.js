import React, {PureComponent} from 'react';
import logo from '../logo.svg';
import { connect } from 'react-redux';

import * as actions from '../redux/actions';

class Brand extends PureComponent {
  onClick = () => {
    this.props.toggle_sidebar(this.props.page.sidebar);
  }

  render () {
    return (
      <div className="app-brand noselect">
        <div className="app-menu-icon" onClick={this.onClick}><i className="fa fa-bars fa-lg"></i></div>
        <div className="app-title">Reef Magic</div>
        {/* <div>
          <div className="app-logo"><img src={logo} alt="logo"/></div>
          <div className="app-title">Reef Magic</div>
        </div> */}
      </div>
    )
  }
}

export default connect(({page}) => ({page}), actions)(Brand);