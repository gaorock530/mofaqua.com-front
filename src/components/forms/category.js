import React, { PureComponent } from 'react';
import Select from './select';

class Category extends PureComponent {
  constructor (props) {
    super(props);
    this.cate1 = ['海水', '淡水', '通用'];
    this.cate2 = ['生物', '设备', '鱼粮/添加'];
    this.cate = {
      a: ['海葵','LPS','SPS','无脊椎动物','吊类','神仙类','小丑类','隆头类','雀鲷类','蝶类','炮弹类','虾虎类','狐狸类','海金鱼','青蛙','藻类','其他'],
      b: ['灯具','造浪','水泵','鱼缸','滤材','溢流','加热/制冷','蛋分','钙反','反应器','管材','工具','其他'],
      c: ['鱼粮','测试剂','鱼药','元素添加','硝化细菌','其他'],
      d: ['龙鱼','罗汉鱼','美洲慈鲷','锦鲤','魟鱼','虎鱼','灯鱼','鼠鱼','鳉鱼','三湖慈鲷',
        '鹦鹉鱼','孔雀鱼','水虎','神仙鱼','七彩神仙鱼','金鱼','兰寿','小型观赏鱼','大型观赏鱼',
        '大型加拉辛','恐龙鱼','植物','其他'],
      e: ['灯具','造浪','水泵','鱼缸','滤材','溢流','加热/制冷','反应器','其他'],
    }
    this.select = {
      cate1: 0,
      cate2: 0,
      cate3: 0
    }
    this.current = this.cate.a;
    this.category = {
      cate1: this.cate1[0],
      cate2: this.cate2[0],
      cate3: this.current[0],
    }
  }

  render3 = () => {
    if (this.select.cate1 === 0) {
      if (this.select.cate2 === 0) this.current = this.cate.a;
      if (this.select.cate2 === 1) this.current = this.cate.b;
      if (this.select.cate2 === 2) this.current = this.cate.c;
    } else if (this.select.cate1 === 1) {
      if (this.select.cate2 === 0) this.current = this.cate.d;
      if (this.select.cate2 === 1) this.current = this.cate.b;
      if (this.select.cate2 === 2) this.current = this.cate.c;
    } else if (this.select.cate1 === 2) {
      if (this.select.cate2 === 0) this.current = ['无'];
      if (this.select.cate2 === 1) this.current = this.cate.b;
      if (this.select.cate2 === 2) this.current = this.cate.c;
    }
    this.select.cate3 = 0;
    this.category.cate3 = this.current[0];
  }

  onChange = (cate, v) => {
    if (cate === 1) {
      this.select.cate1 = v;
      this.category.cate1 = this.cate1[v];
      this.render3();
    } else if (cate === 2) {
      this.select.cate2 = v;
      this.category.cate2 = this.cate2[v];
      this.render3();
    } else if (cate === 3) {
      this.select.cate3 = v;
      this.category.cate3 = this.current[v];
    }
    this.forceUpdate();
    if (this.props.onChange) this.props.onChange(this.category);
  }

  render () {
    return (
      <div className="hori-display">
        <Select options={this.cate1} onChange={this.onChange.bind(this, 1)} default={this.select.cate1}/>
        <Select options={this.cate2} onChange={this.onChange.bind(this, 2)} default={this.select.cate2}/>
        <Select options={this.current} onChange={this.onChange.bind(this, 3)} default={this.select.cate3}/>
      </div>
    )
  }
}

export default Category;