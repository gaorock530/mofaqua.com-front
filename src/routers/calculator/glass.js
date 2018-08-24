import React, {PureComponent} from 'react';
import Input from '../../components/forms/input';
import Save from '../../components/forms/save';
import Static from '../../components/forms/static';

export default class Glass extends PureComponent {
  constructor (props) {
    super(props);
    if (window.localStorage) {
      this.data = JSON.parse(window.localStorage.getItem('calc')) || {
        length: 0,
        width: 0,
        height: 0,
        depth: 0
      };
    } else {
      this.data = {
        length: 0,
        width: 0,
        height: 0,
        depth: 0
      }
    }
    
    this.TensileStrength = 19.3;
    this.SafetyFactor = 3.8;
    //Modulus of Elasticity:69GPa
    this.Elasticity = 69;
    this.reslut = null;
    this.unit = 1;
  }
  renderResult = () => {
    if (!this.reslut) return '';
    return (
      <div className="result">
        <p><i className="fa fa-exclamation-triangle red"></i>
        本计算结果仅供参考，计算页面提供者不承担任何责任。由于玻璃质量、结构缺陷或制作工艺引起的问题更不属于讨论的范围。</p>
        <Static tag="玻璃面积：" text={this.reslut.area}/>
        <Static tag="水体容积：" text={this.reslut.volume}/>
        <Static tag="侧面厚度：" text={this.reslut.glassS}/>
        <Static tag="侧面位移：" text={this.reslut.DeflectionS}/>
        <Static tag="底面厚度：" text={this.reslut.glassB}/>
        <Static tag="底面位移：" text={this.reslut.DeflectionB}/>
      </div>
    )
  }

  ratio = (ratio, bottom = false) => {
    switch (true) {
      case ratio<0.666:
        return {alpha: 0.003,beta: 0.085};
      case ratio>=0.666 && ratio<1:
        return {alpha: 0.0085,beta: 0.1156};
      case ratio>=1 && ratio<1.5:
        if (!bottom) return {alpha: 0.022,beta: 0.16};
        else return {alpha: 0.077,beta: 0.453};
      case ratio>=1.5 && ratio<2:
        if (!bottom) return {alpha: 0.042,beta: 0.26};
        else return {alpha: 0.0906,beta: 0.5172};
      case ratio>=2 && ratio<2.5:
        if (!bottom) return {alpha: 0.056,beta: 0.32};
        else return {alpha: 0.1017,beta: 0.5688};
      case ratio>=2.5 && ratio<3:
        if (!bottom) return {alpha: 0.063,beta: 0.35};
        else return {alpha: 0.111,beta: 0.6102};
      case ratio>=3:
        if (!bottom) return {alpha: 0.067,beta: 0.37};
        else return {alpha: 0.1335,beta: 0.7134};
      default:
        return {alpha: 0.003,beta: 0.085};
    }
  }

  onChange1 = (value) => {
    this.data.length = value;
  }
  onChange2 = (value) => {
    this.data.width = value;
  }
  onChange3 = (value) => {
    this.data.height = value;
  }
  onChange4 = (value) => {
    this.data.depth = value;
  }
  onChange5 = (value) => {
    this.SafetyFactor= value;
  }
  onChange6 = (value) => {
    this.TensileStrength = value;
  }
  onChange7 = (value) => {
    this.Elasticity = value;
  }
  
  onClick = () => {
    if (this.data.length <=0 || this.data.width <=0 || this.data.height <= 0) return;
    if (window.localStorage) {
      window.localStorage.setItem('calc', JSON.stringify(this.data));
    }
    const volume = (this.data.length * this.data.width * this.data.depth)/1000000;
    const area = (this.data.length * this.data.height * 2 +
                 this.data.width * this.data.height * 2 +
                 this.data.length * this.data.width) / 1000000;
    // L/W for side panels
    const ratioS = this.ratio(Math.max(this.data.length, this.data.width)*this.unit / Math.min(this.data.length, this.data.width)*10);
    // L/H for bottom panel
    const ratioB = this.ratio(Math.max(this.data.length, this.data.width)*this.unit / this.data.depth*10 ,true);
    // The water pressure (p) is directly proportional to the Height (H) x the force of gravity (approx 10 (9.81 for people who want to be exact)).
    const p = this.data.depth*this.unit * 9.81; // in N/mm2
    // The bending stress allowed (B) is equal to the Tensile Strength of glass / safety factor.
    const B = this.TensileStrength / this.SafetyFactor; // N/mm2 (Safety factor = 3.8)
    // The thickness of the glass (t) is proportional to the (square root of width factor (beta) x height (H) cubed x 0.00001 / allowable bending stress (B)).
    const tS = Math.sqrt(ratioS.beta * Math.pow(this.data.depth*this.unit, 3) * 0.00001 / B) // in mm.
    /*
      Select beta and alpha from the previous chart based on the length to height ratio.
      The deflection of the glass is proportional to

      (alpha x water pressure (p) x 0.000001 x Height4)
      --------------------------------------------------
      (Modulus of elasticity (E) x Thickness (t) cubed).
    */
    const DeflectionS = (ratioS.alpha * p * 0.000001 * Math.pow(this.data.depth*this.unit, 4)) /
                       (this.Elasticity * 1000 * Math.pow(tS, 3));

    const tB = Math.sqrt(ratioB.beta * Math.pow(this.data.depth*this.unit, 3) * 0.00001 / B);
    const DeflectionB = (ratioB.alpha * p * 0.000001 * Math.pow(this.data.depth*this.unit, 4)) /
                       (this.Elasticity * 1000 * Math.pow(tB, 3));

    this.reslut = {};
    this.reslut.area = this.round(area, 2) + 'm²';
    this.reslut.volume = this.round(volume, 2) + 'L';
    this.reslut.glassS = this.round(tS) + 'mm';
    this.reslut.glassB = this.round(tB) + 'mm';
    this.reslut.DeflectionS = this.round(DeflectionS, 2) + 'mm';
    this.reslut.DeflectionB = this.round(DeflectionB, 2) + 'mm';
    this.forceUpdate();
  }
  round = (value, place = 0) => {
    return Math.round(value * Math.pow(10, place)) / Math.pow(10, place);
  }

  render () {
    return (
      <div>
        <Input tag="安全系数(一般采用3.8)" default={this.SafetyFactor} onBlur={this.onChange5} type="number"/>
        <Input tag="拉伸强度(一般浮法玻璃的拉伸强度为19.3~28.4MPa，钢化玻璃为~175MPa)" default={this.TensileStrength} onBlur={this.onChange6} type="number" options={['MPa']}/>
        <Input tag="弹性系数(一般玻璃弹性系数为69GPa)" default={this.Elasticity} onBlur={this.onChange7} type="number" options={['GPa']}/>
        <Input tag="长度" default={this.data.length} onBlur={this.onChange1} type="number" options={['mm']}/>
        <Input tag="宽度" default={this.data.width} onBlur={this.onChange2} type="number" options={['mm']} />
        <Input tag="高度" default={this.data.height} onBlur={this.onChange3} type="number" options={['mm']} />
        <Input tag="水深" default={this.data.depth} onBlur={this.onChange4} type="number" options={['mm']} />
        <Save onClick={this.onClick} tag="计算" />
        {this.renderResult()}
      </div>
    )
  }
}