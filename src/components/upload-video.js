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
import FileUploadProgress  from 'react-fileupload-progress';
// import HLS from './hls-player';

const reqURL = process.env.NODE_ENV === 'development'? 
'https://localhost:8000/videoupload': 
'https://media.mofaqua.com:8000/videoupload';


 
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
  }
  componentDidMount () {
    this.container = this.refs.display;
    this.process = this.refs.upload;
    this.props.generate_permit();
  }

  accept = ['video/mp4', 'video/mpeg', 'video/quicktime'];

  checkVideo = async (e) => {
    this.uploaded = false;
    const file = e.target.files[0];
    if (file.size > 200 * 1024 * 1024) {
      this.forceUpdate();
      return this.props.notification_in(errmsg.video1);
    }
    this.video = document.createElement('video');
    this.video.src = window.URL.createObjectURL(file);
    this.video.preload = true;
    this.video.addEventListener('loadedmetadata', async (e) => {
      console.log(this.video.duration);
      if (Math.floor(this.video.duration) > 600) {
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
    form.append('stage', 1);
    form.append('permit', this.props.fileUpload.permit);
    try {
      // step 1: upload file 
      this.props.change_upload_state(1);
      const uploaded = await axios.post(reqURL, form, {onUploadProgress: (e) => {console.log(e.loaded/e.total)}});//Math.floor(e.loaded/e.total/100)
      
      console.log(uploaded);
      if (uploaded.data.err) {
        this.props.change_upload_state(0);
        return this.props.notification_in(uploaded.data.err);
      }
      // step 2: converting
      this.props.change_upload_state(2);
      const converted = await axios.post(reqURL, {stage: 2, uid: this.uid, permit: this.props.fileUpload.permit, hash: uploaded.data.hash});
      if (converted.data.err) {
        this.props.change_upload_state(0);
        return this.props.notification_in(converted.data.err);
      }
      this.props.change_upload_state(3, converted.data);  // stage 3 - obs making manifest
      this.uploaded = true;
    }catch(e) {
      this.props.change_upload_state(0);
      // console.log(e);
      return this.props.notification_in('Hacking Action Warning!');
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
        {this.props.fileUpload.inProcess?
        ''
          :<input type="file" id={id} accept="video/*" onChange={this.checkVideo} className="fileInput" />}
        <label ref="upload" htmlFor={id} className='videobutton' style={{color: this.color}}>
          {this.props.fileUpload.inProcess? <Spinner single={false} padding='40px'>上传中</Spinner>:this.uploaded?'视频已上传':children}
        </label>
      
        {/* <Video hlsUrl={'https://localhost:8000/manifest/480p/19dc570d120cc868ab872f8137820ebc/index.m3u8'} /> */}
        {/* <Video hlsUrl={'https://fenxiang2.meiju2018.com/20181013/ZFrpr6x7/index.m3u8'} /> */}
        
      </div>
    )
  }
}

export default connect(({fileUpload}) => ({fileUpload}), actions)(Upload);
