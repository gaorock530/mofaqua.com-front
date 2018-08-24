import React, {Component} from 'react';
import { connect } from 'react-redux';
import Search from './search';

import * as actions from '../../redux/actions';

class SearchSmall extends Component {

  handleSubmuit = (e) => {
    e.preventDefault();
  }
  
  render () {
    return (
      <div className="header-search">
        <Search />
      </div>
    )
  }
}

export default connect(state => state, actions)(SearchSmall);