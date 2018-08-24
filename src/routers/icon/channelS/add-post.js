import React, { PureComponent } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import Page from '../../../components/page';
import * as actions from '../../../redux/actions';
import Quill from 'quill/dist/quill.min.js';
import Switch from '../../../components/forms/switch';
import Select from '../../../components/forms/select';
import Input from '../../../components/forms/input';
import Save from '../../../components/forms/save';


// import cuid from 'cuid';
// import word from '../../../helper/wordcounter';

class AddPost extends PureComponent {
  constructor (props) {
    super(props);
    this.category = {
      a: ['海葵','LPS','SPS','无脊椎动物','吊类','神仙类','小丑类','隆头类','雀鲷类','蝶类','炮弹类','虾虎类','狐狸类','海金鱼','青蛙','藻类','其他'],
      b: ['灯具','造浪','水泵','鱼缸','滤材','溢流','加热/制冷','蛋分','钙反','反应器','管材','工具','其他'],
      c: ['鱼粮','测试剂','鱼药','元素添加','硝化细菌','其他'],
      d: ['龙鱼','罗汉鱼','美洲慈鲷','锦鲤','魟鱼','虎鱼','灯鱼','鼠鱼','鳉鱼','三湖慈鲷',
        '鹦鹉鱼','孔雀鱼','水虎','神仙鱼','七彩神仙鱼','金鱼','兰寿','小型观赏鱼','大型观赏鱼',
        '大型加拉辛','恐龙鱼','植物','其他'],
      e: ['开缸','疾病','繁殖','名词解释','其他']
    }
    this.data = {
      category: {
        level1: 1,
        level2: 1,
        level3: 0
      }
    }
  }
  componentWillMount () {
    this.renderCate();
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

  componentWillUnmount () {
    this.props.redirect();
    this.props.change_form_data('array', null);
  }
  onChangeOrg = (value) => {
    console.log(value);
  }
  onChangeType = (value) => {
    console.log(value);
  }
  onChangeCate1 = (value) => {
    this.data.category.level1 = value;
    this.renderCate();
  }
  onChangeCate2 = (value) => {
    this.data.category.level2 = value;
    this.renderCate();
  }
  onChangeCate3 = (value) => {
    this.data.category.level3 = value;
    this.forceUpdate();
  }
  list = (l) => {
    return l.map((i, index) => {
      return {label: i, value: index};
    })
  }
  renderCate = () => {
    if (this.data.category.level1 === 1) {
      if (this.data.category.level2 === 1) this.props.change_form_data('array', this.list(this.category.a));
      if (this.data.category.level2 === 2) this.props.change_form_data('array', this.list(this.category.b));
      if (this.data.category.level2 === 3) this.props.change_form_data('array', this.list(this.category.c));
      if (this.data.category.level2 === 4) this.props.change_form_data('array', this.list(this.category.e));
    } else if (this.data.category.level1 === 2) {
      if (this.data.category.level2 === 1) this.props.change_form_data('array', this.list(this.category.d));
      if (this.data.category.level2 === 2) this.props.change_form_data('array', this.list(this.category.b));
      if (this.data.category.level2 === 3) this.props.change_form_data('array', this.list(this.category.c));
      if (this.data.category.level2 === 4) this.props.change_form_data('array', this.list(this.category.e));
    } 
  }

  onSubmit = async (e) => {
    e.preventDefault();
    var delta = this.quill.getContents();
    // console.log(delta);
    // for (let i in delta.ops) {
    //   if(delta.ops[i].insert.image) {
    //     let image = delta.ops[i].insert.image;
    //     const url = await processPhoto(image, false, true);
    //     delta.ops[i].insert.image = 'https://zip.gaoqingkong.com/uploads/2018/06/90b0948faffe9b5fb8a2ac07795744e0.png';
    //   }
    // }
    // this.quill.setContents(delta);
    window.localStorage.setItem('edit', JSON.stringify(delta));
    const preview = new Quill('#post-preview', {
      modules: {
        toolbar: false
      },
      readOnly: true,
      // theme: 'snow'  // or 'bubble'
    });
    preview.setContents(delta);
    // console.log(JSON.stringify(delta));
    // this.props.redirect('/channel?t=post');
  }

  render () {
    if (this.props.page.redirect) {
      return <Redirect to={this.props.page.redirect} />
    }
    return (
      <Page wapper={true}>
        <Input tag="文章标题：" placeholder="文章标题"/>
        
 
        <div className="full-title">分类：</div>
        <div className="hori-display-1-1-1">
          <Select options={[
            {label: '海水', value: 1},
            {label: '淡水', value: 2}
          ]} onChange={this.onChangeCate1} default={this.data.category.level1}/>
          <Select options={[
            {label: '生物', value: 1},
            {label: '设备', value: 2},
            {label: '鱼粮/添加', value: 3},
            {label: '其他', value: 4},
          ]} onChange={this.onChangeCate2} default={this.data.category.level2}/>
          <Select options={this.props.form.array} onChange={this.onChangeCate3} default={this.data.category.level3}/>
        </div>


        <section className="hori-display-2-10">
          <label>原创：</label>
          <Switch onChange={this.onChangeOrg} on="是" off="否"/>
        </section>
        <div className="editor"><div id="editor"></div></div>
        <div className="editor"><div id="post-preview"></div></div>
        <Save tag="发布文章"/>

      </Page>
    )
  }
}

export default connect(({form, page}) => ({form, page}), actions)(AddPost);