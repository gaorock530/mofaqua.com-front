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
// import HLS from './hls-player';

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
    const url = 'https://localhost:8000/aed40d2f342f4f598f9f0e42b4f0f02b/manifest/index.m3u8';
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
        {/* {this.uploaded?<Video mpdUrl={this.uploaded.dash[0]} hlsUrl={this.uploaded.hls[0]} options={{autoplay: true, menu: false}} />:''} */}
        {/* <Video mpdUrl="https://websocket.mofaqua.com/videos/cjotxcdsl0016i5fjyrug0pbc.cjp3uh35n001tvjfjym3srm0u.dash/720p/out.mpd"  options={{autoplay: true, menu: false, loop: true}}/> */}
        {/* <Video mpdUrl={url}  options={{autoplay: true, menu: false, loop: true}}/> */}
        <Video hlsUrl={url}/>
        {/* <Video options={{
          autoplay: true,
          controls: false,
          sources: [{
            // src: 'https://localhost:8000/video/Chasing.Coral-720.mp4',
            // type: 'video/mp4'
            src: url,
            type: "application/x-mpegURL"
          }]
        }}/> */}
        {/* <HLS /> */}
      </div>
    )
  }
}

export default connect(({fileUpload}) => ({fileUpload}), actions)(Upload);

// https://obs-b704.obs.cn-north-1.myhwclouds.com:443/obs-manifest/e8e3c5b264a84cf685b15e8d9c266c05/index.mpd?AccessKeyId=VET3LSB76974U2TJR8XB&Expires=1543745682&Signature=srPJZDmqjWJRcDn1dhGr9nNimYQ%3D&x-obs-security-token=gQpjbi1ub3J0aC0xiCe3Wh0j7-Ftb_Rf5RhH2jdrJo0tCSpNwVD6P__30bzxgo1EcHHR2W3E6NvSt3TDyipt7npAeBKG-xFHadCQfRAH1SQmC1MT0A-Sl40JgO9FypgRmN9GS9ix4WNK_7g-TqF_eJ0WdeVbBaEika4mft8nda0a-_8mDt99zJPUiB74yVq_zfIrGDCxrfzC7QsXmGMq4IiIhYixcwh5zROAowr635NpVE4RKYz1aEvZZRzC2V-k6G27UmQ9AoyDqXEK3AXFFKtUPm8qw2bmlRW2lDDfA3OZjzdaBAypLi63J6kq_wSVoyCqtlI4aDHtUwtGs9WwfNhAhQGSHjBVuVFBOwfCpDJWK1h75EaOowjIFLq3rJjICufqIhPMLDriUfXUkyTOR5TZkQMkGLUDuGlhJWatMQX1QMyy99yF1aMswjfcHf5KDe0sa1haoDl_XpYWHyNWwAVgmnQ3judeJJphiv1MO93AUrX9uhznar5KV7s190Qfp30SfcPG8J8cjoc331p8hREPDWaJ4NdMc4REFUn9cXtbipaNm8Yui_JFK2AodzSr2-ueZ-r407I5YKCr3ioAT-R_5C9kLZdnIbKgVAhHuzBU7v_WvkA1YhqdUJ89MMsJ_29v06-ZluRniIC0DVbAkl-LDfzQ8hkvBLzCTY1ySzSb7ckGrFskIZFT8mTqh9uNhRi0MJsFHyKDnSWl_bjb9auRL8kOoyJw6luX5XM%3D