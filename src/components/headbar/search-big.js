import React, {PureComponent} from 'react';
import { connect } from 'react-redux';

import Search from './search';

import * as actions from '../../redux/actions';

class SearchBig extends PureComponent {
  
  render () {
    return (
      <div className="small-window-search">
        <div className="search-arrow" onClick={this.props.toggle_small_window}><i className="fa fa-arrow-left"></i></div>
        <Search />
      </div>
    )
  }
}

export default connect(null, actions)(SearchBig);