import React, {PureComponent} from 'react';
import { connect } from 'react-redux';
import Brand from './brand';
import Tools from './headbar/tools';
import SearchSmall from './headbar/search-small';
import SearchBig from './headbar/search-big';

import * as actions from '../redux/actions';

class Header extends PureComponent {
  
  render () {
    return this.props.page.smallWindow ? <SearchBig /> : 
      (
        <header className="app-header">
          <Brand />
          <SearchSmall />
          <Tools />
        </header>
      )
  }
}

export default connect(({page}) => ({page}), actions)(Header);