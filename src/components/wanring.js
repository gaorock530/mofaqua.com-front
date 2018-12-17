import React, {PureComponent} from 'react';
import { connect } from 'react-redux';
import * as actions from '../redux/actions';

class Warning extends PureComponent {


  onClick = (v) => {
    if (!v) return this.props.reset_warning();
    this.props.warning.fn();
  }

  onBlindClick = (v) => {
    if (this.inside) return;
    this.props.reset_warning();
  }

  render () {
    return this.props.warning.text? (
      <div className="great-warning-wrapper" onClick={this.onBlindClick.bind(this, false)}>
        <div className="warning-box" onMouseEnter={() => this.inside = true} onMouseLeave={() => this.inside = false}>
          <div className="warning-message">{this.props.warning.text || ''}</div>
          <div className="warning-button-group">
            <button className="red" onClick={this.onClick.bind(this, true)}><i className="fa fa-check-circle"></i>确定</button>
            <button className="green" onClick={this.onClick.bind(this, false)}><i className="fa fa-times-circle"></i>取消</button>
          </div>
        </div>
      </div>
    ): ''
  }
}

export default connect(({warning}) => ({warning}), actions)(Warning);