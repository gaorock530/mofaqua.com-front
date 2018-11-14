import React, {Component} from 'react';
import { connect } from 'react-redux';
import * as actions from '../redux/actions';

// class Cover extends Component {  
//   render () {
//     return (
//       <div className="app-cover hide" onClick={this.props.toggle_sidebar}></div>
//     )
//   }
// }
const Cover = (props) => {  

  return (
    <div className="app-cover hide" onClick={props.toggle_sidebar}></div>
  )

}

export default connect(null, actions)(Cover);