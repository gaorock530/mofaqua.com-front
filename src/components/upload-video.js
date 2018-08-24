import React, { PureComponent } from 'react';
import Spinner from './animates/spinner';
import { connect } from 'react-redux';
import cuid from 'cuid';
import * as actions from '../redux/actions';
import { hex_md5 } from '../helper/md5';


 
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
    this.video = null;
    this.color = this.props.color || '#666699';
  }
  componentDidMount () {
    this.container = document.querySelector('.video-preview');
    this.process = this.refs.upload;
    this.temp = null;
  }

  componentWillUnmount () {
    this.props.destroy_file(this.id);
  }

  accept = ['video/mp4', 'video/mpeg', 'video/quicktime'];


  onUpload = (e) => {
    if (e.target.files[0] === this.video || !e.target.files[0] || e.target.files[0].size < 1024) return;
    const file = e.target.files[0];
    const size = e.target.files[0].size;
    const chunk = 1024*512;
    const slice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice;
    let counter = 0;
    this.url = window.URL.createObjectURL(file);
    
    const read = () => {
      this.process.innerHTML = Math.floor((counter*chunk) / size * 100) + '%';
      let reader = new FileReader();
      reader.addEventListener('load', (e) => {
        if (counter*chunk < size) read();
        else {
          console.log('done', counter)
          this.process.innerHTML = '100%';
          if (!this.video) {
            this.video = document.createElement('video');
            this.container.appendChild(this.video);
          }
          this.video.src = this.url;
          this.video.preload = true;
          this.video.controls = true;
        }
        reader = undefined;
      }, {once: true});
      const buffer = slice.call(file, counter*chunk, counter*chunk + chunk, file.type);
      reader.readAsDataURL(buffer);
      counter++;
    }

    read();


    // actual file
    // this.video = e.target.files[0];
    // console.log(e.target.files[0]);
    // // check type
    // const type = this.accept.indexOf(this.video.type) >= 0;
    // if (!type || this.video.size <= 1000) return this.props.notification_in(cuid(), '格式不正确');
    
    // this.video.mb = (this.video.size / 1000 / 1000).toFixed(2);
    // // this.video.md5 = hex_md5(JSON.stringify({type: this.video.type, size: this.video.size}));
    // this.reader.readAsDataURL(this.video);

    

    // this.url = window.URL.createObjectURL(this.video);
    

    // video.addEventListener('loadedmetadata', (e) => {
    //   const fen = Math.floor(e.target.duration / 60);
    //   const miao = Math.floor(e.target.duration % 60);
    //   this.video.duration = {fen, miao};

    //   if (this.container.children.length > 0) {
    //     this.container.removeChild(this.temp);
    //   }
    //   this.container.appendChild(video);
    //   this.temp = video;
    // }, {once: true});
    
    // this.props.set_temp({id: this.id, size: this.video.size});
    
    // // check size
    // const size = this.image.size / 1000 / 1000 < 3; // Mb
    // if (!size) return this.props.notification_in(cuid(), '超过3Mb');
    // console.log(this.image.size);
    // uploading
    // try {
    //   // process image
    //   // this.url = await processPhoto(this.image, this.props.crop, this.props.opt, this.props.width, this.props.height);
    //   await this.props.uploading_file(this.id, this.video);
    // } catch (e) {
    //   return this.props.notification_in(cuid(), '网络错误，稍后请重试');
    // }
    
    // this.refs.upload.style.backgroundImage = `url('${this.url}')`;
    // this.props.notification_in(cuid(), '图片上传成功', this.url);
    // // excute custom event
    // if (this.props.onChange) {
    //   this.props.onChange(this.image);
    // };
  }
  render () {
    const {
      className = '',
      id, 
      children = '上传文件'
    } = this.props;
    const uploading = this.props.page.uploadFiles[this.id] && this.props.page.uploadFiles[this.id].isUploading;
    const uploaded = this.props.page.uploadFiles[this.id] && !this.props.page.uploadFiles[this.id].isUploading;
    return (
      <div className={"uploadWapper " + className}>
        <input type="file" id={id} accept="video/*" onChange={this.onUpload} className="fileInput" />
        <label ref="upload" htmlFor={id} className='videobutton' style={{color: this.color}}>上传文件</label>
        {uploading? <Spinner position="mid" single={true} size="12px"/>:''}
        {uploaded? <div className="addon-video-info">
          <li><span>文件名：</span><span>{this.video.name}</span></li>
          <li><span>视频时长：</span><span>{this.video.duration.fen + '分' + this.video.duration.miao + '秒'}</span></li>
          <li><span>视频大小：</span><span>{this.video.mb + 'MB'}</span></li>
          <li><span>MD5：</span><span>{this.video.md5}</span></li>
          <li><span>是否通过：</span><span><i className={`fa fa-${(this.video.duration.fen>5 || this.video.mb > 10)?'times red':'check green'}`}></i></span></li>
        </div>:''}
        <div className='video-preview'>
        </div>
      </div>
    )
  }
}

export default connect(state => state, actions)(Upload);