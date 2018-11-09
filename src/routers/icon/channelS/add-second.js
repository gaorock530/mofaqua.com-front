import React, { PureComponent } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import Page from '../../../components/page';
import * as actions from '../../../redux/actions';
import Quill from 'quill/dist/quill.min.js';
import processPhoto from '../../../helper/processPhoto';
// import $ from 'jquery';
import Input from '../../../components/forms/input';
import Select from '../../../components/forms/select';
import Save from '../../../components/forms/save';
import Address from '../../../components/forms/address';
import Categoty from '../../../components/forms/category';

import ErrorText from '../../../helper/errorText';


import cuid from 'cuid';
// import { options } from 'sw-toolbox';
// import word from '../../../helper/wordcounter';

class AddSecond extends PureComponent {
  constructor (props) {
    super(props);
    this.info = {
      title: {
        pass: false,
        value: ''
      },
      address: {
        pass: false,
        value: null
      },
      category: {
        cate1: "海水",
        cate2: "生物",
        cate3: "海葵"
      },
      newLevel: 9,
      price: 0,
      shippingPrice: 0,
      content: null
    }
    this.life = true;
  }

  componentDidMount () {
    var toolbarOptions = [
      ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
    
      [{ 'header': [1, 2, 3, false] }],
    
      [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
      [{ 'align': [] }],
      ['image'],                                        // insert images
      ['clean']                                         // remove formatting button
    ];
    this.quill = new Quill('#editor', {
      modules: {
        toolbar: toolbarOptions
      },
      placeholder: '编辑二手物品详情...',
      theme: 'snow'  // or 'bubble'
    });
  }
  
  componentWillUnmount () {
    this.props.redirect();
  }

  // display selling level depends on cate2 '生物'
  onCateChange = (v) => {
    let life;
    this.info.category = v;
    if (v.cate2 === '生物') {
      life = true;
    } else {
      life = false;
    }
    if (life !== this.life) {
      this.life = life;
      this.forceUpdate();
    }
  }
 
  /* render selling level */
  renderLevel = () => {
    let l = [];
    for(let i=9;i>0;i--) {
      l.push(i+'成新');
    }
    return l;
  }

  onChangeLevel = (value) => {
    this.info.newLevel = 9 - value;
    this.forceUpdate();
  }
  
  onTitle = (value, op, pass) => {
    if (!pass) {
      this.info.title.value = '';
      this.info.title.pass = false;
    }else {
      this.info.title.value = value;
      this.info.title.pass = true;
    }
  }

  validateTitle = (v) => {
    if (v.length === 0 || v.length > 50) {
      return false;
    }
    return true;
  }

  onPrice = (value) => {
    this.info.price = parseInt(value, 10);
  }
  onShipping = (value) => {
    this.info.shippingPrice = parseInt(value, 10);
  }
  address = (data, third) => {
    if (data.city === '' || (data.area === '' && third === true)) {
      this.info.address.pass = false;
    } else {
      this.info.address.pass = true;
    }
    this.info.address.value = data;
  }
  
  onSubmit = async (e) => {
    e.preventDefault();
    
    
    if (!this.info.title.pass) return this.props.notification_in(cuid(), ErrorText.title);
    if (!this.info.address.pass) return this.props.notification_in(cuid(), ErrorText.address);
    if (this.info.price <= 0 || this.info.shippingPrice < 0) return this.props.notification_in(cuid(), ErrorText.price);
    let photo = false;
    this.info.content = this.quill.getContents();
    for (let i in this.info.content.ops) {
      if(this.info.content.ops[i].insert.image) {
        photo = true;
        let image = this.info.content.ops[i].insert.image;
        const url = await processPhoto(image, false, true);
        this.info.content.ops[i].insert.image = url;
      }
    }
    if (!photo) return this.props.notification_in(cuid(), ErrorText.photoExist);
    console.log(this.info);
    // this.props.redirect('/channel?t=second');
  }
  

  render () {
    if (this.props.page.redirect) {
      return <Redirect to={this.props.page.redirect} />
    }
    return (
      <Page wapper={true}>
        <Input label="二手标题：" placeholder="标题" onBlur={this.onTitle} condition={this.validateTitle} errorText={ErrorText.title}/>
          <div className="full-title">地区：</div>
          <Address list={this.address}/>
          <div className="full-title">分类：</div>
          <Categoty onChange={this.onCateChange}/>
          {
            !this.life? (
              <div>
                <div className="full-title">新旧程度：</div>
                <Select options={this.renderLevel()} onChange={this.onChangeLevel} default={9 - this.info.newLevel} />
              </div>
            ):''
          }
          <Input label="价格：" onBlur={this.onPrice} placeholder="价格" tag='元' type="number" condition={(v) => parseInt(v, 10) > 0} errorText={ErrorText.price}/>
          <Input label="邮费：" onBlur={this.onShipping} placeholder="邮费(如不填写或为0则视为包邮)" tag='元' type="number" condition={(v) => parseInt(v, 10) >= 0} errorText={ErrorText.shippingPrice}/>
        <section className="editor">
          <div id="editor"></div>
        </section>
        <Save tag="发布二手信息" onClick={this.onSubmit}/>
      </Page>
    )
  }
}

export default connect(({page, form}) => ({page, form}), actions)(AddSecond);