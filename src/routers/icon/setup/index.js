import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../../redux/actions';
import Details from './details';
import Notice from './notification';
import Channel from './channel';
import Privacy from './privacy';
import Page from '../../../components/page';


class Setup extends PureComponent {
  constructor (props) {
    super(props);
    this.ops = [
      { k: 'details', v: '账号' },
      { k: 'notice', v: '通知'},
      { k: 'channel', v: '频道'},
      { k: 'privacy', v: '隐私'}
    ];
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

export default connect(({page, user}) => ({page, user}), actions)(Setup);