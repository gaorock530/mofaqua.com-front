import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../../redux/actions';
import Person from './person';
// import Account from './account';
import Identity from './identity';
import Address from './address';
import Seller from './seller';
import Page from '../../../components/page';

class Personal extends Component {
  async componentWillMount () {
    await this.props.get_user_info(this.props.user.user.UID);
  }

  componentWillUnmount () {
    this.props.current_setup_page(null);
  }

  renderRight = () => {
    switch (this.props.page.setupPage) {
      case 'person':
        return <Person />;
      // case 'account':
      //   return <Account />;
      case 'identity':
        return <Identity />;
      case 'address':
        return <Address />;
      case 'seller':
        return <Seller />;
      default:
        return <Person />;
    }
  }

  onClick = (page, e) => {
    if (page === this.props.page.setupPage) return;
    for(let el of e.target.parentElement.children) {
      el.classList.remove('active');
    }
    e.target.classList.add('active');
    this.props.current_setup_page(page);
  }

  render () {
    return (
      <Page wapper={true}>
        <div className="twocol-container">
          <div className="twocol-left noselect">
            <a onClick={this.onClick.bind(this, 'person')} className="active">个人资料</a>
            {/* <a onClick={this.onClick.bind(this, 'account')}>资产管理</a> */}
            <a onClick={this.onClick.bind(this, 'identity')}>实名认证</a>
            <a onClick={this.onClick.bind(this, 'address')}>收货信息</a>
            <a onClick={this.onClick.bind(this, 'seller')}>店铺管理</a>
          </div>
          <div className="twocol-right">
            {this.renderRight()}
          </div>
        </div>
      </Page>
    )
  }
}

export default connect(state => state, actions)(Personal);