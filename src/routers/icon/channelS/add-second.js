import React, { PureComponent } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import Page from '../../../components/page';
import * as actions from '../../../redux/actions';
import Quill from 'quill/dist/quill.min.js';
import processPhoto from '../../../helper/processPhoto';
import $ from 'jquery';
import Input from '../../../components/forms/input';
import Select from '../../../components/forms/select';
import Save from '../../../components/forms/save';


// import cuid from 'cuid';
// import { options } from 'sw-toolbox';
// import word from '../../../helper/wordcounter';

class AddSecond extends PureComponent {
  constructor (props) {
    super(props);
    this.area = [];
    this.props.set_pageLoading(true);
    this.category = {
      a: ['海葵','LPS','SPS','无脊椎动物','吊类','神仙类','小丑类','隆头类','雀鲷类','蝶类','炮弹类','虾虎类','狐狸类','海金鱼','青蛙','藻类','其他'],
      b: ['灯具','造浪','水泵','鱼缸','滤材','溢流','加热/制冷','蛋分','钙反','反应器','管材','工具','其他'],
      c: ['鱼粮','测试剂','鱼药','元素添加','硝化细菌','其他'],
      d: ['龙鱼','罗汉鱼','美洲慈鲷','锦鲤','魟鱼','虎鱼','灯鱼','鼠鱼','鳉鱼','三湖慈鲷',
        '鹦鹉鱼','孔雀鱼','水虎','神仙鱼','七彩神仙鱼','金鱼','兰寿','小型观赏鱼','大型观赏鱼',
        '大型加拉辛','恐龙鱼','植物','其他'],
      e: ['灯具','造浪','水泵','鱼缸','滤材','溢流','加热/制冷','反应器','其他'],
    }
    this.data = {
      area: {
        province: {name: '', value: 0},
        city: {name: '', value: 0},
        area: {name: '', value: 0},
      },
      level: 9,
      category: {
        level1: 1,
        level2: 1,
        level3: 0
      }
    }
  }
  componentWillMount () {
    
    if(!window.localStorage.getItem('area')) {
      $.ajax({
        url: "https://apis.map.qq.com/ws/district/v1/list?key=BBYBZ-2A66F-UDJJ2-NSWRG-VD3TZ-VSFE2&output=jsonp&callback=cb",
        type: "get",   //post请求方式
        dataType: "jsonp",
        jsonpCallback: "cb",
        success: (data) => {
          this.area = data.result;
          this.props.set_pageLoading(false);
          window.localStorage.setItem('area', JSON.stringify(data.result));
        }
      });
    } else {
      this.area = JSON.parse(window.localStorage.getItem('area'));
      this.props.set_pageLoading(false);
    }
    
    this.props.set_location_array('city', [{label: '请选择', value: 0}]);
    this.props.set_location_array('area', [{label: '请选择', value: 0}]);
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
      placeholder: '编辑二手物品详情...',
      theme: 'snow'  // or 'bubble'
    });
  }
  
  componentWillUnmount () {
    this.props.redirect();
    this.props.change_form_data('array', null);
  }

  onProvinceChange = (value) => {
    this.data.area.province.value = value;
    this.data.area.province.name = value === 0?'':this.area[0][value-1].fullname;
    this.data.area.city = {name: '', value: 0};
    this.data.area.area = {name: '', value: 0};
    if (value === 0) {
      this.props.set_location_array('city', [{label: '请选择', value: 0}]);
      this.props.set_location_array('area', [{label: '请选择', value: 0}]);
    } else {
      const index = this.area[0][value-1].cidx;
      const array = this.area[1].slice(index[0], index[1]+1);
      this.props.set_location_array('city', this.listarea(array));
      this.props.set_location_array('area', [{label: '请选择', value: 0}]);
    }
  }
  onCityChange = (value) => {
    this.data.area.city.value = value;
    this.data.area.city.name = value === 0?'':this.props.page.city[value].label;
    this.data.area.area = {name: '', value: 0};
    if (value === 0) {
      this.props.set_location_array('area', [{label: '请选择', value: 0}]);
    } else {
      const index = this.props.page.city[value].cidx;
      if (!index) {
        this.props.set_location_array('area', [{label: '请选择', value: 0}]);
      } else {
        const array = this.area[2].slice(index[0], index[1]+1);
        this.props.set_location_array('area', this.listarea(array));
      }
    }
  }
  onAreaChange = (value) => {
    this.data.area.area.value = value;
    this.data.area.area.name = value === 0?'':this.props.page.area[value-1].label;
    this.forceUpdate();
  }
 
  /* render selling level */
  renderLevel = () => {
    let l = [];
    for(let i=9;i>0;i--) {
      l.push({label: i+'成新', value: i});
    }
    return l;
  }
  onChangeLevel = (value) => {
    this.data.level = value;
    this.forceUpdate();
  }
  list = (l) => {
    return l.map((i, index) => {
      return {label: i, value: index};
    })
  }
  listarea = (l = []) => {
    let c = [{label: '请选择', value: 0}];
    for (let i=0;i<l.length;i++) {
      c.push({label: l[i].fullname, value: i+1, cidx: l[i].cidx});
    }
    return c;
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
  renderCate = () => {
    if (this.data.category.level1 === 1) {
      if (this.data.category.level2 === 1) this.props.change_form_data('array', this.list(this.category.a));
      if (this.data.category.level2 === 2) this.props.change_form_data('array', this.list(this.category.b));
      if (this.data.category.level2 === 3) this.props.change_form_data('array', this.list(this.category.c));
    } else if (this.data.category.level1 === 2) {
      if (this.data.category.level2 === 1) this.props.change_form_data('array', this.list(this.category.d));
      if (this.data.category.level2 === 2) this.props.change_form_data('array', this.list(this.category.b));
      if (this.data.category.level2 === 3) this.props.change_form_data('array', this.list(this.category.c));
    } else if (this.data.category.level1 === 3) {
      if (this.data.category.level2 === 1) this.props.change_form_data('array', [{label: '无', value: 0}]);;
      if (this.data.category.level2 === 2) this.props.change_form_data('array', this.list(this.category.b));
      if (this.data.category.level2 === 3) this.props.change_form_data('array', this.list(this.category.c));
    }
  }
  onPrice = (value) => {
    this.price = value;
    console.log(this.price);
  }
  onShipping = (value) => {
    this.shipping = value;
    console.log(this.shipping);
  }

  
  onSubmit = async (e) => {
    e.preventDefault();
    var delta = this.quill.getContents();
    console.log(this.data);
    for (let i in delta.ops) {
      if(delta.ops[i].insert.image) {
        let image = delta.ops[i].insert.image;
        const url = await processPhoto(image, false, true);
        console.log(typeof url);
        delta.ops[i].insert.image = url;
      }
    }
    console.log(delta);
    // this.props.redirect('/channel?t=second');
  }

  render () {
    if (this.props.page.redirect) {
      return <Redirect to={this.props.page.redirect} />
    }
    return (
      <Page wapper={true}>
          <Input tag="二手标题：" placeholder="标题"/>
            <div className="full-title">地区：</div>
            {this.props.page.pageLoading? 'Loading...': 
              <div className="hori-display-1-1-1">
                <Select options={this.listarea(this.area[0])} onChange={this.onProvinceChange} default={this.data.area.province.value}/>
                <Select options={this.props.page.city} onChange={this.onCityChange} default={this.data.area.city.value}/>
                <Select options={this.props.page.area} onChange={this.onAreaChange} default={this.data.area.area.value}/>
              </div>
            }
            
            <div className="full-title">分类：</div>
            <div className="hori-display-1-1-1">
              <Select options={[
                {label: '海水', value: 1},
                {label: '淡水', value: 2},
                {label: '通用', value: 3}
              ]} onChange={this.onChangeCate1} default={this.data.category.level1}/>
              <Select options={[
                {label: '生物', value: 1},
                {label: '设备', value: 2},
                {label: '鱼粮/添加', value: 3},
              ]} onChange={this.onChangeCate2} default={this.data.category.level2}/>
              <Select options={this.props.form.array} onChange={this.onChangeCate3} default={this.data.category.level3}/>
            </div>
            <div className="full-title">新旧程度：</div>
            <Select options={this.renderLevel()} onChange={this.onChangeLevel} default={this.data.level}/>
            <Input tag="价格：" onBlur={this.onPrice} placeholder="价格" options={['元']} default={0} type="number"/>
            <Input tag="邮费：" onBlur={this.onShipping} placeholder="邮费" options={['元']} default={0} type="number"/>
          <section className="editor">
            <div id="editor"></div>
          </section>
          <Save tag="发布二手信息"/>
      </Page>
    )
  }
}

export default connect(({page, form}) => ({page, form}), actions)(AddSecond);