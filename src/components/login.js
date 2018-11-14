import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import Computer from './login/computer';
import Qrcode from './login/qrcode';

import * as actions from '../redux/actions';

const Login = (props) => {
  const { from } = props.location.state || { from: { pathname: "/" } };
  const { isLogin } = props.user;

  if (isLogin) {
    this.onLogin = false;
    return <Redirect to={from} />;
  } 

  const toogle_form = (value) => {
    props.set_login_method(value);
  }

  return (
    <div>
      <section className="header-mask"></section> 
      <section className="login-page">
        <div className="form-nav">
          <nav onClick={toogle_form.bind(this, true)} className={props.page.loginMethod?'formactive': ''}>电脑登陆</nav>
          <nav onClick={toogle_form.bind(this, false)} className={props.page.loginMethod?'': 'formactive'}>二维码登陆</nav>
        </div>
        {props.page.loginMethod? <Computer />: <Qrcode />}
      </section>
    </div>
  )

}

export default connect(({page, user}) => ({page, user}), actions)(Login);