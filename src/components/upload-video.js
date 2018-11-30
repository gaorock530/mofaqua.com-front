import React, { PureComponent } from 'react';
import Spinner from './animates/spinner';
import { connect } from 'react-redux';
import cuid from 'cuid';
import * as actions from '../redux/actions';
// import { hex_md5 } from '../helper/md5';
// import counterDown from '../helper/formatCountDown';
// import Bytes from '../helper/formatBytes';
import errmsg from '../helper/errorText';
import Video from '../components/video';
import axios from 'axios';

const reqURL = process.env.NODE_ENV === 'development'? 
'https://localhost:5000/videoupload': 
'https://websocket.mofaqua.com/videoupload';


 
/**
 * @param {String} image default image url
 * @param {String} className custom styles
 * @param {String} id unique id for each input element
 * @param {Elements} children <label>some text</label>
 * @param {Boolean} round true - border redius 50%
 * @param {COLOR} color (optional) #666699
 * @param {Function} onChange callback with raw file data
 * @param {Boolean} crop (required) whether resize pic
 * @param {Boolean} opt (required)  whether optimize pic
 * @param {Number} width (optional) if resize, the new width
 * @param {Number} height (optional) if resize, the new height, defalut 16:9
*/

class Upload extends PureComponent {
  componentWillMount () {
    this.id = cuid();
    this.uploaded = null;
    this.slice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice;
    this.color = this.props.color || '#666699';
    this.timer = null;  // a timer to refresh transferred bytes and transfer rate;
    this.transferRate = 0;  // transfer rate over 3 seconds
    this.transferred = 0; // record bytes transferred in one second
    this.timeLeft = 0; // record time to upload
    this.dataLeft = 0; // record data lefted to transfer
    this.rateRefresh = 0; // a counter for refresh transfer rate [every 3 sec]
    this.hash = null; // store video hash
    this.uid = this.props.uid;
    this.isUploading = false;
    this.status = ['上传中', '转码中', '封装中'];
  }
  componentDidMount () {
    this.container = this.refs.display;
    this.process = this.refs.upload;
    this.props.generate_permit();
  }

  componentWillUnmount () {
    this.props.destroy_file();
  }

  accept = ['video/mp4', 'video/mpeg', 'video/quicktime'];

  checkVideo = async (e) => {
    this.uploaded = null;
    this.isUploading = true;
    this.forceUpdate();
    const file = e.target.files[0];
    if (file.size > 200 * 1024 * 1024) {
      this.isUploading = false;
      this.forceUpdate();
      return this.props.notification_in(errmsg.video1);
    }
    this.video = document.createElement('video');
    this.video.src = window.URL.createObjectURL(file);
    this.video.preload = true;
    this.video.addEventListener('loadedmetadata', async (e) => {
      console.log(this.video.duration);
      if (Math.floor(this.video.duration) > 600) {
        this.isUploading = false;
        this.forceUpdate();
        return this.props.notification_in(errmsg.video2);
      }
      await this.onUpload(file);
    }, {once: true})
    this.video.addEventListener('error', async (e) => {
      await this.onUpload(file);
    }, {once: true})
  }


  onUpload = async (file) => {
    const form = new FormData();
    form.append('file', file);
    form.append('uid', this.uid);
    form.append('process', 1);
    form.append('permit', this.props.fileUpload.permit);
    try {
      // step 1: upload file 
      this.props.change_upload_state(1);
      const uploaded = await axios.post(reqURL, form);
      if (uploaded.data.err) {
        this.props.change_upload_state(0);
        return this.props.notification_in(uploaded.data.err);
      }
      console.log(uploaded.data)
      this.props.change_upload_state(2);
      const converted = await axios.post(reqURL, {process: 2, uid: this.uid, permit: this.props.fileUpload.permit});
      if (converted.data.err) {
        this.props.change_upload_state(0);
        return this.props.notification_in(converted.data.err);
      }
      console.log(converted.data);
      this.props.change_upload_state(3);
      const manifest = await axios.post(reqURL, {process: 3, uid: this.uid, permit: this.props.fileUpload.permit});
      if (manifest.data.err) {
        this.props.notification_in(converted.data.err);
      }
      this.props.change_upload_state(0);
      console.log(manifest.data);
      this.isUploading = false;
      this.uploaded = manifest.data.url;
      
    }catch(e) {
      return this.props.notification_in(e);
    }
    this.forceUpdate()

  }


  render () {
    const {
      className = '',
      id, 
      children = '上传文件'
    } = this.props;
    return (
      <div className={"uploadWapper " + className}>
        {this.props.fileUpload.inProcess?'':<input type="file" id={id} accept="video/*" onChange={this.checkVideo} className="fileInput" />}
        <label ref="upload" htmlFor={id} className='videobutton' style={{color: this.color}}>
          {this.props.fileUpload.inProcess? <Spinner single={true}>{this.status[this.props.fileUpload.process-1]}</Spinner>:children}
        </label>
        {this.uploaded?<Video mpdUrl={this.uploaded.dash[0]} hlsUrl={this.uploaded.hls[0]} options={{autoplay: true, menu: false}} />:''}
        {/* <Video mpdUrl="https://localhost:5000/videos/cjon0c9d20002xnfyp5de3vh8.cjp39fddf0003q6fyih43tvnu.dash/720p/out.mpd"/> */}
      </div>
    )
  }
}

export default connect(({fileUpload}) => ({fileUpload}), actions)(Upload);