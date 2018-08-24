import React, {PureComponent} from 'react';
import Page from '../../components/page';
import { connect } from 'react-redux';
import * as actions from '../../redux/actions';
import Drug from './drug';
import Salt from './salt';
import Glass from './glass';
import Flow from './flow';

class Calculator extends PureComponent {
  componentWillMount () {
    this.props.current_setup_page('');
  }
  renderRight = () => {
    switch (this.props.page.setupPage) {
      case 'drug':
        return <Drug />;
      case 'salt':
        return <Salt />;
      case 'glass':
        return <Glass />;
      case 'flow':
        return <Flow />;
      default:
        return <Drug />;
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
            <a onClick={this.onClick.bind(this, 'drug')} className="active">药剂添加</a>
            <a onClick={this.onClick.bind(this, 'salt')}>海盐添加</a>
            <a onClick={this.onClick.bind(this, 'glass')}>玻璃厚度</a>
            <a onClick={this.onClick.bind(this, 'flow')}>水流计算</a>
          </div>
          <div className="twocol-right">
            {this.renderRight()}
          </div>
        </div>
      </Page>
    )
  }
}

export default connect(state => state, actions)(Calculator);