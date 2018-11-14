import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../../redux/actions';
import Person from './person';
// import Account from './account';
import Message from './message';
import Address from './address';
import Assets from './assets';
import Page from '../../../components/page';

class Personal extends PureComponent {
  constructor (props) {
    super(props);
    this.ops = [
      { k: 'person', v: '个人资料' },
      { k: 'message', v: '消息管理'},
      { k: 'address', v: '交易管理'},
      { k: 'assets', v: '资产管理'}
    ]
    // if (!this.props.page.setupPage) this.props.current_setup_page('person');
  }

  async componentWillMount () {
    await this.props.get_user_info(this.props.user.user.UID);
  }

  componentWillUnmount () {
    // this.props.current_setup_page(null);
  }

  renderRight = () => {
    switch (this.props.page.setupPage) {
      case 'person':
        return <Person />;
      case 'message':
        return <Message />;
      case 'address':
        return <Address />;
      case 'assets':
        return <Assets />;
      default:
        return <Person />;
    }
  }

  onClick = (page) => {
    if (page === this.props.page.setupPage) return;
    this.props.current_setup_page(page);
  }

  renderOp = () => {
    return this.ops.map((op) => 
      <a onClick={this.onClick.bind(this, op.k)} key={op.k}
      className={this.props.page.setupPage === op.k? 'active': null}
      >{op.v}</a>
    )
  }

  render () {
    return (
      <Page wapper={true}>
        <div className="twocol-container">
          <div className="twocol-left noselect">
            {this.renderOp()}
          </div>
          <div className="twocol-right">
            {this.renderRight()}
          </div>
        </div>
      </Page>
    )
  }
}

export default connect(({user, page}) => ({user, page}), actions)(Personal);