import React, { PureComponent } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import Page from '../../../components/page';
import Upload from '../../../components/upload-video';
import * as actions from '../../../redux/actions';
import Input from '../../../components/forms/input';
import Switch from '../../../components/forms/switch';
import Select from '../../../components/forms/select';
import Textarea from '../../../components/forms/textarea';
import Save from '../../../components/forms/save';

// import cuid from 'cuid';
// import word from '../../../helper/wordcounter';

class AddVideo extends PureComponent {
  constructor (props) {
    super(props);
    this.data = {
      title: '',
      origin: true,
      type: true,
      list: 0,
      keyword: [],
      note: ''
    }
  }
  componentWillUnmount () {
    this.props.redirect();
  }
  renderList = () => {
    let l = ['无'];
    for(let i=0;i<10;i++) {
      l.push(i+1);
    }
    return l;
  }

  onTitle = value => {
    this.data.title = value;
  }
  onOchange = value => {
    this.data.origin = value;
  }
  onTypechange = value => {
    this.data.type = value;
  }
  onList = value => {
    this.data.list = value;
    this.forceUpdate();
  }
  onKeywords = (value) => {
    console.log(value);
  }
  onNote = (value) => {
    console.log(value);
  }

  onSubmit = (e) => {
    e.preventDefault();
    console.log(this.data);
    // this.props.redirect('/channel');
  }

  render () {
    if (this.props.page.redirect) {
      return <Redirect to={this.props.page.redirect} />
    }
    return (
      <Page wapper={true}>
        <Upload id="video">选择视频</Upload>
        <Input label="视频标题:" onBlur={this.onTitle} placeholder="视频标题"/>
        <div className="left-align">
          <Switch label="类型：" onChange={this.onTypechange} on="海水" off="淡水"/>
          <Switch label="原创：" onChange={this.onOchange} on="是" off="否"/>
        </div>
        <Select label="播放列表:" options={this.renderList()} onChange={this.onList} default={this.data.list}/>
        <Textarea tag="关键字：" onBlur={this.onKeywords} placeholder="输入关键字： 例如#小丑鱼，多个关键字用逗号隔开"></Textarea>
        <Textarea tag="介绍：" label="视频介绍：" onBlur={this.onNote} max="200" placeholder="输入视频简介：最多200个字"></Textarea>
        <Save tag="发布视频" />
      </Page>
    )
  }
}

export default connect(state => state, actions)(AddVideo);