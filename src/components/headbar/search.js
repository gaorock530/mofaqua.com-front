import React, {PureComponent} from 'react';
import { connect } from 'react-redux';

import cuid from 'cuid';

import * as actions from '../../redux/actions';

class Search extends PureComponent {
  list = [
    { text: 'all声卡', type: 'pic' },
    { text: 'aasdas打瞌睡打开阿拉山口的；是的看料理打瞌睡打开阿拉山口的；是的看料理', type: 'text' },
    { text: 'asked撒大理石的', type: 'pic' },
    { text: 'aasdas this is askd asjsjdjskd aksdjaksd sdfjs dkfjsdk ass aks kkkj.', type: 'pic' },
    { text: '打瞌睡打开阿拉山口的；是的看料理', type: 'vid' },
  ]

  onChange = () => {
    this.props.set_search_text(this.refs.searchText.value)
  }

  onBlur = () => {
    // this.refs.searchText.value = '';
    // this.props.set_search_text(this.refs.searchText.value)
    this.props.set_search_text()
  }

  renderList = () => {
    return this.props.page.searchText === '' ? '' : this.list.map(item => {
      return (
        <div className="search-result-list" key={cuid()}>
          <a>{item.text}</a>
          <span>{item.type}</span>
        </div>
      )
    })
  }

  handleSubmuit = (e) => {
    e.preventDefault();
  }
  
  render () {
    return (
      <div className="search-box-wapper">
        <form className="search-box" onSubmit={this.handleSubmuit} onBlur={this.onBlur}>
          <input type="text" ref="searchText" placeholder="Search" onChange={this.onChange}/>
          <button><i className="all-center fa fa-search"></i></button>
        </form>
        <div className="search-result">
          {this.renderList()}
        </div>
      </div>
    )
  }
}

export default connect(({page}) => ({page}), actions)(Search);