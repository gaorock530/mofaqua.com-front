import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../../redux/actions';
import Person from './person';
// import Account from './account';
import Message from './message';
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
      case 'message':
        return <Message />;
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
            <a onClick={this.onClick.bind(this, 'message')}>消息管理</a>
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