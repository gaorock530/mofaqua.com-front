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
import UploadImg from '../../../components/upload';
import UTCtime from '../../../helper/utctime';
import fileSize from '../../../helper/formatBytes';

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
      note: '',
      video: null
    }
    this.block = true;
    this.track = {index: -1};
    this.selectUploaded = true;
  }
  componentWillMount () {
    window.addEventListener('mouseup', this.onMouseUp);
    window.addEventListener('touchend', this.onMouseUp);
    window.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('touchmove', this.onMouseMove);
    this.props.get_unfinished_videos();
    this.unlock = this.props.history.block(() => {
      if (!this.props.fileUpload.allDone) {
        return '注意：上传的视频还没有发布！确定要离开吗？';
      }
      return true;
    });
    window.addEventListener('beforeunload', this.leaveWarning);
  }
  componentWillUnmount () {
    console.log('unmount')
    this.props.change_upload_state();
    window.removeEventListener('mouseup', this.onMouseUp);
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('touchend', this.onMouseUp);
    window.removeEventListener('touchmove', this.onMouseMove);
    window.removeEventListener('beforeunload', this.leaveWarning);
    this.unlock();
  }

  leaveWarning = (e) => {
    if (!this.props.fileUpload.allDone) e.returnValue = '没有提交';
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

  leave = () => {
    this.props.history.goBack()
  }

  onMouseDown = (index, e) => {
    if (!this.track.obj) this.track.obj = this.refs[`vid${index}`];
    if (index !== this.track.index) {
      this.track.lock = false;
      this.track.obj.style.left = 0;
      this.track.obj = this.refs[`vid${index}`];
      this.track.index = index;
    } 
    if (this.track.templock) {
      this.track.obj.style.left = 0;
      this.track.diff = 0;
      this.track.templock = false;
    }
    this.track.clientX = typeof e.clientX !== 'undefined'?e.clientX:e.touches[0].clientX;
  }
  onMouseMove = (e) => {
    const after = typeof e.clientX !== 'undefined'?e.clientX:e.touches[0].clientX;
    const diff = this.track.clientX - after;
    if (this.track.index === -1 || diff <= 0 || this.track.templock) return;
    this.track.obj.style.left = -diff+'px';
    this.track.diff = diff;
  }
  onMouseUp = (e) => {
    if (this.track.index === -1 || !this.track.obj) return;
    if (this.track.diff >= 100) {
      this.track.obj.style.left = -80+'px';
      this.track.lock = true;
      this.track.templock = true;
    }else {
      this.track.diff = 0;
      this.track.index = -1;
      this.track.clientX = null;
      this.track.obj.style.left = 0;
      this.track.obj = null;
      this.track.lock = false;
    }
  }

  onClick = (index) => {
    if (this.track.index === index) return;
    this.track.index = index;
    if (this.props.fileUpload.file) this.selectUploaded = false;
    // save uploaded video's id
    this.props.set_publish_video_hash(this.props.user.unfinishedVideos[index].hash);
    // this.data.video = this.props.user.unfinishedVideos[index].hash;
    this.forceUpdate();
  }

  deleteVedio = (hash) => {
    this.props.init_warning('您要删除已上传的视频，是否确定？', this.props.del_video.bind(this, hash));
    this.track.diff = 0;
  }

  renderUnfinishedVideos = () => {
    
    if (!this.props.user.unfinishedVideos || this.props.user.unfinishedVideos.length === 0) return '';
    return (
      <div>
        <div className="full-title">未发布视频：<span className="note">*选择后继续发布,向左拖拽删除</span></div>
        {this.props.user.unfinishedVideos.map((video, index) => {
          return (
            <div key={index} className="unpublishedvideo-wrapper">
              <div ref={`vid${index}`} className="unpublishedvideo hover" 
              onMouseDown={this.onMouseDown.bind(this, index)} 
              onTouchStart={this.onMouseDown.bind(this, index)} 
              onClick={this.onClick.bind(this, index)}
              >
                <div className="img" style={{backgroundImage: `url('https://media.mofaqua.com:8000/cover/${video.hash}')`}}></div>
                <div className="info">
                  <div>文件名：{video.info.name}</div>
                  <div>视频画质：{video.info.quality}</div>
                  <div>文件大小：{fileSize(video.info.size)}</div>
                  <div>上传时间：{UTCtime(video.uploadDate)}</div>
                </div>
                <div><i className={`fa fa-check-circle fa-2x${this.track.index === index && (!this.props.fileUpload.file ^ !this.selectUploaded)? ' select':''}`}></i></div>
              </div>
              <div className="delete" onClick={this.deleteVedio.bind(this, video.hash)}><i className="fa fa-times-circle fa-3x"></i></div>
            </div>
            )
        })}
      </div>
    )
  }
  onClickUploaded = () => {
  
    this.selectUploaded = true;
    if (this.track.obj && this.track.lock) {
      this.track.obj.style.left = 0;
      this.track.obj = null;
      this.track.lock = false;
    }
    this.track.index = -1;
    this.props.set_publish_video_hash(this.props.fileUpload.file.hash);
    console.log(this.selectUploaded, this.props.fileUpload.file, this.selectUploaded ^ this.props.fileUpload.file);
    this.forceUpdate()
  }

  publish = async () => {
    this.data.video = this.props.fileUpload.toPublish;
    console.log(this.data);
    try {
      await this.props.publish_video(this.data);
      this.props.change_upload_state(0);
      this.props.history.push('/channel');
    }catch(e) {
      return this.props.notification_in(e);
    }
  }

  render () {
  
    return (
      <Page wapper={true}>
        <Upload id="video" uid={this.props.user.user.UID}>选择视频</Upload>
        {this.props.fileUpload.file? <div className="unpublishedvideo-wrapper">
              <div className="unpublishedvideo hover" 
              onClick={this.onClickUploaded}
              >
                <div className="img" style={{backgroundImage: `url('https://media.mofaqua.com:8000/cover/${this.props.fileUpload.file.hash}')`}}></div>
                <div className="info">
                  <div>文件名：{this.props.fileUpload.file.info.name}</div>
                  <div>视频画质：{this.props.fileUpload.file.info.quality}</div>
                  <div>文件大小：{fileSize(this.props.fileUpload.file.info.size)}</div>
                  <div>上传时间：{UTCtime(this.props.fileUpload.file.uploadDate)}</div>
                </div>
                <div><i className={`fa fa-check-circle fa-2x${this.selectUploaded? ' select':''}`}></i></div>
              </div>
            </div>: ''}
        {this.renderUnfinishedVideos()}
        <Input label="视频标题:" onBlur={(v) => this.data.title = v} placeholder="视频标题"/>
        <div className="left-align">
          <Switch label="原创：" onChange={(v) => this.data.origin = v}/>
        </div>
        <Select label="播放列表:" options={this.renderList()} onChange={this.onList} default={this.data.list}/>
        <div className="full-title">分类：</div>
        <Category onChange={(v) => this.data.type = v} />
        <Textarea tag="介绍：" label="视频介绍：" onBlur={(v, l) => this.data.note = l?null:v} max="500" placeholder="输入视频简介：最多200个字" />
        <Save text="发布" onClick={this.publish}/>
        <Save text="取消" onClick={this.props.history.goBack}/>
      </Page>
    )
  }
}

export default connect(({user, fileUpload}) => ({user, fileUpload}), actions)(AddVideo);