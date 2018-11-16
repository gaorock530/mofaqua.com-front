import React, { PureComponent } from 'react';
import Spinner from './animates/spinner';
import { connect } from 'react-redux';
import cuid from 'cuid';
import * as actions from '../redux/actions';
import processPhoto from '../helper/processPhoto';
require('jimp/browser/lib/jimp');
 
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
    this.type = this.props.type;
  }

  componentWillUnmount () {
    this.props.destroy_file(this.id);
  }

  accept = ['image/gif', 'image/jpeg', 'image/png'];

  onUpload = async (e) => {
    if (e.target.files[0] === this.image || !e.target.files[0]) return;
    if (!this.type) return console.log('missing upload type');
    // actual file
    this.image = e.target.files[0];
    // check type
    const type = this.accept.indexOf(this.image.type) >= 0;
    if (!type) return this.props.notification_in('格式不正确');
    // check size
    const size = this.image.size / 1000 / 1000 < 3; // Mb
    if (!size) return this.props.notification_in('超过3Mb');
    console.log(this.image.size);
    // uploading
    try {
      // process image
      const newPhoto = await processPhoto(this.image, this.props.crop || false, this.props.opt || false, this.props.width, this.props.height);
      const res = await this.props.uploading_pic(this.id, newPhoto, this.type); 
      if (!res) return this.props.notification_in('图片上传失败,请重试');
      this.refs.upload.style.backgroundImage = `url('${newPhoto.url}')`;
      this.props.notification_in('图片上传成功', newPhoto.url);
    } catch (e) {
      console.log(e);
      return this.props.notification_in('网络错误，稍后请重试');
    }
    // excute custom event
    if (this.props.onChange) {
      this.props.onChange(this.image);
    };
  }

  render () {
    const {
      className = '',
      id, 
      children = '上传文件',
      round = false,
      color = null,
      image = null
    } = this.props;
    const uploading = this.props.page.uploadFiles[this.id] && this.props.page.uploadFiles[this.id].isUploading;
    const percent = this.props.page.uploadFiles[this.id]?this.props.page.uploadFiles[this.id].percentage+'%':0;
    return (
      <div className={"uploadWapper " + className}>
        <input type="file" id={id} accept="image/gif, image/jpeg, image/png" onChange={this.onUpload} className="fileInput" />
        <label ref="upload" htmlFor={id} className={round?"fileCover round": "fileCover"} style={{borderColor: color?color:'#666699', backgroundImage: image?`url(${image})`:'none'}}>
            <span>
              {uploading?percent: children}
            </span>
            
        </label>
        {uploading? <Spinner position="mid" single={true} size="32px"/>:''}
      </div>
    )
  }
}

export default connect(({page}) => ({page}), actions)(Upload);