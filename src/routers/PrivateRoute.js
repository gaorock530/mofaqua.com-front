import React from 'react';
import {Route, Redirect} from 'react-router-dom';
import { connect } from 'react-redux';

class PrivateRoute extends React.Component {
  render () {
    const { component: Component, ...rest } = this.props;

    return (
      <Route
        {...rest}
        render={props =>
          this.props.user.isLogin ? (
            <Component {...props} />
          ) : (
            <Redirect
              to={{
                pathname: "/login",
                state: { from: props.location }
              }}
            />
          )
        }
      />
    )
  }
} 

const mapStateToProps = (state) => {
  return { user: state.user};
}

export default connect(mapStateToProps)(PrivateRoute);