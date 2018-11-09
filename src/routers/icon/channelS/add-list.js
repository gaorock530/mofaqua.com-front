import React, { PureComponent } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import Page from '../../../components/page';
import * as actions from '../../../redux/actions';
import Input from '../../../components/forms/input';
import Textarea from '../../../components/forms/textarea';
import Save from '../../../components/forms/save';

class AddList extends PureComponent {
  constructor (props) {
    super(props);
    this.data = {
      name: '',
      keyword: [],
      note: ''
    };
  }
  componentWillUnmount () {
    this.props.redirect();
  }
  onNameChange = value => {
    this.data.name = value;
  }
  onKeywords = () => {
    this.data.keyword = this.refs.keyword.value.split('#').filter(key => key.trim() !== '').map(key => key.trim());
    console.log(this.refs.keyword.value);
  }
  onNote = () => {
    this.data.note = this.refs.note.value.trim();
    console.log(this.refs.note.value);
  }



  onSubmit = (e) => {
    e.preventDefault();
    console.log(this.data);
    // this.props.redirect('/channel?t=playlist');
  }

  render () {
    if (this.props.page.redirect) {
      return <Redirect to={this.props.page.redirect} />
    }
    return (
      <Page wapper={true}>
        <Input label="列表名称：" placeholder="列表名称" onBlur={this.onNameChange}/>
        <Textarea label="关键字：" placeholder="关键字"/>
        <Textarea label="介绍：" placeholder="视频介绍" max="200"/>
        <Save text="创建列表" />
      </Page>
    )
  }
}

export default connect(state => state, actions)(AddList);