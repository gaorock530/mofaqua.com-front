import React, { PureComponent } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import Page from '../../../components/page';
import Upload from '../../../components/upload';
import cuid from 'cuid';
import word from '../../../helper/wordcounter';
import Input from '../../../components/forms/input';
import Switch from '../../../components/forms/switch';
import Select from '../../../components/forms/select';
import Save from '../../../components/forms/save';

import * as actions from '../../../redux/actions';

class AddTank extends PureComponent {
  constructor (props) {
    super(props);
    this.data = {
      name: '',
      type: true,
      func: 0,
      life: 0,
      main: {
        length: null,
        width: null,
        height: null,
        depth: null
      },
      sump: {
        length: null,
        width: null,
        height: null,
        depth: null
      }
    }
  }
  componentWillUnmount () {
    this.props.redirect(); // clear/cancel redirect
  }

  onSubmit = (e) => {
    e.preventDefault();
    if (Object.keys(this.props.page.uploadFiles).length === 0) return this.props.notification_in(cuid(), '主缸照片未上传');
    if (this.data.name === '') return this.props.notification_in(cuid(), '主缸昵称未填写');
    const len = word(this.data.name); // trim, no space, only letters and number
    if (!len) return this.props.notification_in(cuid(), '主缸昵称格式错误：不能有空格和特殊字符');
    if ( len > 12) return this.props.notification_in(cuid(), '主缸昵称长度不能超过12个字母或6个中文');
    const Mlength = parseInt(this.refs.Mlength.value, 10);
    if (typeof Mlength !== 'number' || Mlength === 0 || isNaN(Mlength)) return this.props.notification_in(cuid(), '主缸长度填写有误');
    const Mwidth = parseInt(this.refs.Mwidth.value, 10);
    if (typeof Mwidth !== 'number' || Mwidth === 0 || isNaN(Mwidth)) return this.props.notification_in(cuid(), '主缸宽度填写有误');
    const Mheight = parseInt(this.refs.Mheight.value, 10);
    if (typeof Mheight !== 'number' || Mheight === 0 || isNaN(Mheight)) return this.props.notification_in(cuid(), '主缸高度填写有误');
    const Mdepth = parseInt(this.refs.Mdepth.value, 10);
    if (typeof Mdepth !== 'number' || Mdepth === 0 || isNaN(Mdepth) || Mdepth >= Mheight) return this.props.notification_in(cuid(), '主缸水深填写有误');
    // optional

    if (this.refs.Slength.value !== '' || this.refs.Swidth.value !=='' || this.refs.Sheight.value !== '' || this.refs.Sdepth.value !== '') {
      const Slength = parseInt(this.refs.Slength.value, 10);
      if (typeof Slength !== 'number' || Slength === 0 || isNaN(Slength)) return this.props.notification_in(cuid(), '底缸长度填写有误');
      const Swidth = parseInt(this.refs.Swidth.value, 10);
      if (typeof Swidth !== 'number' || Swidth === 0 || isNaN(Swidth)) return this.props.notification_in(cuid(), '底缸宽度填写有误');
      const Sheight = parseInt(this.refs.Sheight.value, 10);
      if (typeof Sheight !== 'number' || Sheight === 0 || isNaN(Sheight)) return this.props.notification_in(cuid(), '底缸高度填写有误');
      const Sdepth = parseInt(this.refs.Sdepth.value, 10);
      if (typeof Sdepth !== 'number' || Sdepth === 0 || isNaN(Sdepth) || Sdepth >= Sheight) return this.props.notification_in(cuid(), '底缸水深填写有误');
      console.log(this.data);
    }
  }
  onName = (value) => {
    this.data.name = value;
  }

  onFunc = value => {
    this.data.func = value;
    this.forceUpdate();
  }
  onLife = value => {
    this.data.life = value;
    this.forceUpdate();
  }
  onMlength = value => {
    this.data.main.length = value;
  }
  onMwidth = value => {
    this.data.main.width = value;
  }
  onMheight = value => {
    this.data.main.height = value;
  }
  onMdepth = value => {
    this.data.main.depth = value;
  }
  onSlength = value => {
    this.data.main.length = value;
  }
  onSwidth = value => {
    this.data.sump.width = value;
  }
  onSheight = value => {
    this.data.main.height = value;
  }
  onSdepth = value => {
    this.data.main.depth  = value;
  }

  change = (file) => {
    console.log(file);
    console.log(this.props.page.uploadFiles);
  }
 

  render () {
    if (this.props.page.redirect) {
      return <Redirect to={this.props.page.redirect} />
    }
    return (
      <Page wapper={true}>
        <div className="add-tank">
          <Upload id="tank" className="tank-photo" onChange={this.change} color="#666699" width={1100} crop={true} opt={true}>上传照片</Upload>
          <h3>基本信息(必填)</h3>

            <Input tag="昵称：" onBlur={this.onName} placeholder="为鱼缸取个酷炫的名字"/>
          <div className="hori-display-2-10">
            <label>类型：</label>
            <Switch on="海水" off="淡水"/>
          </div>


          <Select tag="功能：" options={[
            {label: '展示', value: 0},
            {label: '检疫', value: 1},
            {label: '繁殖', value: 2},
            {label: '断枝', value: 3},
          ]} default={this.data.func} onChange={this.onFunc}/>


          <Select tag="生物：" options={[
            {label: 'FOT', value: 0},
            {label: '海葵/软体', value: 1},
            {label: 'LPS', value: 2},
            {label: 'SPS', value: 3},
            {label: '混合', value: 4},
          ]} default={this.data.life} onChange={this.onLife}/>

          <h3>主缸信息(必填)</h3>

            <Input tag="长度：" onBlur={this.onMlength} type="number" options={['cm']} default={this.data.main.length}/>


            <Input tag="宽度：" onBlur={this.onMwidth} type="number" options={['cm']} default={this.data.main.height}/>


            <Input tag="高度：" onBlur={this.onMheight} type="number" options={['cm']} default={this.data.main.width}/>


            <Input tag="水深：" onBlur={this.onMdepth} type="number" options={['cm']} default={this.data.main.depth}/>

          <h3>底缸信息(选填)</h3>


            <Input tag="长度：" onBlur={this.onSlength} type="number" options={['cm']} default={this.data.main.length}/>


            <Input tag="宽度：" onBlur={this.onSwidth} type="number" options={['cm']} default={this.data.main.width}/>


            <Input tag="高度：" onBlur={this.onSheight} type="number" options={['cm']} default={this.data.main.height}/>


            <Input tag="水深：" onBlur={this.onSdepth} type="number" options={['cm']} default={this.data.main.depth}/>

          <Save tag="开启奇妙的水族之旅"/>
        </div>
      </Page>
    )
  }
}

export default connect(state => state, actions)(AddTank);