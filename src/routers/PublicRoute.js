import React from 'react';
import {Route, Redirect} from 'react-router-dom';
import { connect } from 'react-redux';

class PublicRoute extends React.Component {
  render () {
    const { component: Component, ...rest } = this.props;

    return (
      <Route
        {...rest}
        render={props =>
          this.props.ws.connection && !this.props.user.isLogin ? (
            <Component {...props} />
          ) : (
            <Redirect
              to={{
                pathname: "/",
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
  return { user: state.user, ws: state.ws};
}

export default connect(mapStateToProps)(PublicRoute);