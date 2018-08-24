import React, {Component} from 'react';
import { connect } from 'react-redux';
import Brand from './brand';
import Menu from './sidebar/menu';
import Subscription from './sidebar/subscription';
import Category from './sidebar/category';
import Trade from './sidebar/trade';
import Utils from './sidebar/utils';
import Footer from './sidebar/footer';

import { Scrollbars } from 'react-custom-scrollbars';

import * as actions from '../redux/actions';

class Sidebar extends Component {

  render () {
    // const toggleClass = this.props.page.sidebar ? 'app-sidebar': 'app-sidebar sidebar-hide';
    return (
      <div className="app-sidebar sidebar-open" ref="sidebar">
        <Brand />
        <Scrollbars className="scroll-wapper">
          <div className="app-sidebar-body noselect" ref="sideBarBody">
            <Menu />
            {this.props.user.isLogin ? <Subscription /> : ''}
            <Category />
            <Trade />
            <Utils />
            <Footer />
          </div>
        </Scrollbars>
      </div>
    )
  }
}

export default connect(state => state, actions)(Sidebar);