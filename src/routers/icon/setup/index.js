import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../../redux/actions';
import Details from './details';
import Notice from './notification';
import Channel from './channel';
import Privacy from './privacy';
import Page from '../../../components/page';


class Setup extends Component {
  componentWillMount () {
    this.props.current_setup_page(null);
  }
  componentWillUnmount () {
    this.props.current_setup_page(null);
  }
  renderRight = () => {
    switch (this.props.page.setupPage) {
      case 'details':
        return <Details />;
      case 'notice':
        return <Notice />
      case 'channel':
        return <Channel />
      case 'privacy':
        return <Privacy />
      default:
        return <Details />;
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
            <a onClick={this.onClick.bind(this, 'details')} className="active">账号</a>
            <a onClick={this.onClick.bind(this, 'notice')}>通知</a>
            <a onClick={this.onClick.bind(this, 'channel')}>频道</a>
            <a onClick={this.onClick.bind(this, 'privacy')}>隐私</a>
          </div>
          <div className="twocol-right">
            {this.renderRight()}
          </div>
        </div>
      </Page>
    )
  }
}

export default connect(state => state, actions)(Setup);