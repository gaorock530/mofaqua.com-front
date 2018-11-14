import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import * as actions from '../redux/actions';
import Upload from './upload';

class Edit extends PureComponent {
  componentWillMount () {
    document.querySelector('body').classList.toggle('frozen');
    // window.addEventListener('scroll', this.disable);
    if (!this.props.page.edit) throw Error('missing ID');
    this.data = this.props.page.lazyLoad[this.props.page.channelTab].data.filter((item) => {
      return item.id === this.props.page.edit; 
    })[0];
    this.name = this.data.title;
  }
  componentWillUnmount () {
    // window.removeEventListener('scroll', this.disable);
    document.querySelector('body').classList.toggle('frozen');
  }
 
  close = () => {
    this.props.set_edit_page();
  }
  onChange = () => {
    this.name = this.refs.name.value;
  }
  onBlur = () => {

    this.props.set_temp()
  }
  onClick = (value) => {
    this.props.set_temp(value);
  }

  titleShow = () => {
    return (
      <div>
        <label>名称：</label>
        <a onClick={this.onClick.bind(this, 'name')}>{this.name}</a>
      </div>
    )
  }
  titleChange = () => {
    return (
      <div>
        <input type="text" ref="name" defaultValue={this.name} onChange={this.onChange} onBlur={this.onBlur} autoFocus />
        <a>取消</a>
        <a>确定</a>
      </div>
    )
  }

  render () {
    return (
      <div className="form-edit">
        <div className="edit-header"><a onClick={this.close}><i className="fa fa-remove"></i></a></div>
        <div className="edit-form">
          <form className="edit-wapper">
            <div className="cover"><Upload id="cover" width={800} height={500} crop={true} opt={true} image={this.data.pic} color="#666699">更换封面</Upload></div>
            <div className="item">
              {this.props.page.temp === 'name'?this.titleChange():this.titleShow()}
            </div>
            <div className="item">
              <a>删除</a>
            </div>
            <div className="submit">
              <button>保存asdasd</button>
            </div>
          </form>
        </div>
      </div>
    )
  }
}

export default connect(({page}) => ({page}), actions)(Edit);

