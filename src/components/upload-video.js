import React, { PureComponent } from 'react';
import Spinner from './animates/spinner';
import { connect } from 'react-redux';
import cuid from 'cuid';
import * as actions from '../redux/actions';
import { hex_md5 } from '../helper/md5';
import counterDown from '../helper/formatCountDown';
import Bytes from '../helper/formatBytes';
import Video from '../components/video';
import axios from 'axios';

const reqURL = process.env.NODE_ENV === 'development'? 
'https://localhost:5000/': 
'https://websocket.mofaqua.com/';


 
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
  }
  componentDidMount () {
    this.container = this.refs.display;
    this.process = this.refs.upload;
  }

  componentWillUnmount () {
    this.props.destroy_file(this.id);
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
      return this.props.notification_in('视频文件不能超过200Mb');
    }
    this.video = document.createElement('video');
    this.video.src = window.URL.createObjectURL(file);
    this.video.preload = true;
    this.video.addEventListener('loadedmetadata', async (e) => {
      console.log(this.video.duration);
      if (Math.floor(this.video.duration) > 600) {
        this.isUploading = false;
        this.forceUpdate();
        return this.props.notification_in('视频长度不能超过10分钟');
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
    try {
      const res = await axios.post(reqURL, form);
      if (res.data.err) this.props.notification_in(res.data.err);
      this.isUploading = false;
      this.uploaded = res.data.url;
      console.log(res.data)
    }catch(e) {

    }
    this.forceUpdate()
    
    // console.log(e.target.files[0]);
    // if (e.target.files[0] === this.video || !e.target.files[0] || e.target.files[0].size < 1024) return;
    // const file = e.target.files[0];
    // const size = file.size;
    // // const type = file.type.split('/')[1];
    // const extension = file.name.split('.')[1];
    // const chunk = 1024*512;
    // let counter = 0; // tracking transfer index
    // this.dataLeft = size;

    
    // // console.log(file);
    // this.timer = setInterval(() => {
    //   this.dataLeft -= this.transferred;
    //   this.timeLeft = Math.round(this.dataLeft / this.transferred);
    //   this.rateRefresh++;
    //   if (this.rateRefresh === 3) {
    //     this.transferRate = this.transferred;
    //     this.rateRefresh = 0;
    //   }
    //   this.transferred = 0;
    // }, 1000);


    // const read = () => {
    //   this.process.innerHTML = Math.floor((counter*chunk) / size * 100) + '%  剩余：' + counterDown(this.timeLeft) + ' rate:' + Bytes(this.transferRate) + '/s';
    //   let reader = new FileReader();
    //   reader.addEventListener('load', async (e) => {
    //     if (!this.hash) this.hash = hex_md5(e.target.result);
    //     const data = e.target.result.slice(22);
    //     // record bytes has been treansfered
    //     this.transferred += chunk;
    //     // console.log(chunk, this.transferRate);
    //     // counter++
    //     await this.props.upload_video(
    //       data,  // strip base64 metadata
    //       counter++,
    //       this.hash,
    //       extension
    //     )
    //     // loop to transfer data
    //     if (counter*chunk < size) read();
    //     // transfer finished
    //     else { 
    //       // send last bit of data, index = -1
    //       const result = await this.props.upload_video(data, -1);
    //       console.log(result);
    //       // stop counter
    //       clearInterval(this.timer);
    //       // initialize arguments
    //       this.transferRate = 0;  // transfer rate over 3 seconds
    //       this.transferred = 0; // record bytes transferred in one second
    //       this.timeLeft = 0; // record time to upload
    //       this.dataLeft = 0; // record data lefted to transfer
    //       this.rateRefresh = 0; // a counter for refresh transfer rate [every 3 sec]
    //       // change display 
    //       this.process.innerHTML = '已上传';
    //       // add video preview
    //       this.uploaded = result.server;
    //       this.forceUpdate();
    //       // if (!this.video) {
    //       //   this.video = document.createElement('video');
    //       //   this.container.appendChild(this.video);
    //       // }
    //       // this.video.src = window.URL.createObjectURL(file);
    //       // this.video.preload = true;
    //       // this.video.controls = true;
    //     }
    //     // clear memory
    //     reader = undefined;
    //   }, {once: true});

    //   const buffer = this.slice.call(file, counter*chunk, counter*chunk + chunk, file.type);
    //   reader.readAsDataURL(buffer);
    // }

    // read();

  }


  render () {
    const {
      className = '',
      id, 
      children = '上传文件'
    } = this.props;
    // const uploading = this.props.page.uploadFiles[this.id] && this.props.page.uploadFiles[this.id].isUploading;
    // const uploaded = this.props.page.uploadFiles[this.id] && !this.props.page.uploadFiles[this.id].isUploading;
    return (
      <div className={"uploadWapper " + className}>
        {this.isUploading?'':<input type="file" id={id} accept="video/*" onChange={this.checkVideo} className="fileInput" />}
        
        <label ref="upload" htmlFor={id} className='videobutton' style={{color: this.color}}>{this.isUploading? <Spinner single={false} size="12px" padding="12px"/>:children}</label>
        {this.uploaded?<Video mpdUrl={this.uploaded}/>:''}
        {/* <Video mpdUrl="https://localhost:5000/videos/ChasingCoral.1080/out.mpd"/> */}
        {/* {uploading? <Spinner position="mid" single={true} size="12px"/>:''}
        {uploaded? <div className="addon-video-info">
          <li><span>文件名：</span><span>{this.video.name}</span></li>
          <li><span>视频时长：</span><span>{this.video.duration.fen + '分' + this.video.duration.miao + '秒'}</span></li>
          <li><span>视频大小：</span><span>{this.video.mb + 'MB'}</span></li>
          <li><span>MD5：</span><span>{this.video.md5}</span></li>
          <li><span>是否通过：</span><span><i className={`fa fa-${(this.video.duration.fen>5 || this.video.mb > 10)?'times red':'check green'}`}></i></span></li>
        </div>:''} */}
        <div className='video-preview' ref="display"></div>
      </div>
    )
  }
}

export default connect(null, actions)(Upload);