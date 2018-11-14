import React from 'react';
// import { connect } from 'react-redux';
import Search from './search';

// import * as actions from '../../redux/actions';

export default () => {

  return (
    <div className="header-search">
      <Search />
    </div>
  )
  
}
// export default class SearchSmall extends PureComponent {

//   handleSubmuit = (e) => {
//     e.preventDefault();
//   }
  
//   render () {
//     return (
//       <div className="header-search">
//         <Search />
//       </div>
//     )
//   }
// }

// export default connect(state => state, actions)(SearchSmall);