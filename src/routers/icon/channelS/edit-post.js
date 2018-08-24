import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../../redux/actions';
import cuid from 'cuid';
import Page from '../../../components/page';
// import Select from '../../../components/forms/select';
// import List from '../../../components/forms/list';
// import Textarea from '../../../components/forms/textarea';
import Input from '../../../components/forms/input';
import Save from '../../../components/forms/save';
// import Warning from '../../../components/forms/warning';
import Quill from 'quill/dist/quill.min.js';

/**
 * @param {Function} onSave fires when click save
 */

class EditList extends PureComponent {
  constructor (props) {
    super(props);
    this.data = {
      name: '',
    }; 
  }
  componentWillMount () {
  }
  componentDidMount () {
    var toolbarOptions = [
      ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
    
      [{ 'header': [1, 2, 3, false] }],
    
      [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
      [{ 'align': [] }],
      ['image', 'video'],
      ['clean']                                         // remove formatting button
    ];
    this.quill = new Quill('#editor', {
      modules: {
        toolbar: toolbarOptions
      },
      placeholder: 'Compose an epic...',
      theme: 'snow'  // or 'bubble'
    });
    if (window.localStorage.getItem('edit')) {
      const text = JSON.parse(window.localStorage.getItem('edit'));
      this.quill.setContents(text);
    }
    
  }

  onSave = () => {
    if (this.data.name === '' || this.data.num < 1) return;
    if (this.props.onSave) {
      if (isNaN(this.data.num)) this.data.num = 1;
      this.props.onSave(this.data);
    }
  }

  render () {
    return (
      <Page wapper={true}>
        <Input tag="文章名称" defalut={this.props.title || ''}/>
        <div className="editor"><div id="editor"></div></div>
        <Save tag="保存更改" onClick={this.onSave}/>
        <Save tag="删除文章" red={true} onClick={this.onSave}/>
      </Page>
    )
  }
}

export default connect(state => state, actions)(EditList);