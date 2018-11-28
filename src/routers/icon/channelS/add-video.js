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
import Category from '../../../components/forms/category';
import Save from '../../../components/forms/save';

// import cuid from 'cuid';
// import word from '../../../helper/wordcounter';

class AddVideo extends PureComponent {
  constructor (props) {
    super(props);
    this.data = {
      title: '',
      origin: true,
      type: {cate1: "海水", cate2: "生物", cate3: "海葵"},
      list: 0,
      note: ''
    }
  }
  componentWillUnmount () {
    this.props.redirect();
  }
  // demo
  renderList = () => {
    let l = ['无'];
    for(let i=0;i<10;i++) {
      l.push(i+1);
    }
    return l;
  }

  onList = value => {
    this.data.list = value;
    this.forceUpdate();
  }

  render () {
    if (this.props.page.redirect) {
      return <Redirect to={this.props.page.redirect} />
    }
    return (
      <Page wapper={true}>
        <Upload id="video" uid={this.props.user.user.UID}>选择视频</Upload>
        <Input label="视频标题:" onBlur={(v) => this.data.title = v} placeholder="视频标题"/>
        <div className="left-align">
          <Switch label="原创：" onChange={(v) => this.data.origin = v}/>
        </div>
        <Select label="播放列表:" options={this.renderList()} onChange={this.onList} default={this.data.list}/>
        <div className="full-title">分类：</div>
        <Category onChange={(v) => this.data.type = v} />
        <Textarea tag="介绍：" label="视频介绍：" onBlur={(v, l) => this.data.note = l?null:v} max="500" placeholder="输入视频简介：最多200个字" />
        <Save text="发布" onClick={() => console.log(this.data)}/>
      </Page>
    )
  }
}

export default connect(state => state, actions)(AddVideo);