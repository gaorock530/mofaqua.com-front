import React, {PureComponent} from 'react';
import Input from '../../components/forms/input';
import Save from '../../components/forms/save';
import Static from '../../components/forms/static';
import Select from '../../components/forms/select';

export default class Drug extends PureComponent {
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
    this.sump = {
      length: 0,
      width: 0,
      height: 0,
      depth: 0
    }
    // dose unit, value
    this.dose = {
      amount: {unit: 0, value: 0},
      quantity: {unit: 0, value: 0},
    }
    this.choose = {
      opMain: 0,  
      opTank: 2,
      opCust: 0
    };
    // all Units 
    this.unit = {
      1: ['ml', 'g', 'mg', 'us Oz', 'uk Oz'],
      2: ['L', 'us Gal', 'uk Gal'],
      3: ['mm', 'cm', 'inch', 'foot']
    }
    this.factor = {
      1: [1, 3.7854118, 4.5460919, 0.2641721, 1.2009504, 0.2199692, 0.8326738],
      2: [1, 10, 25.4, 304.8],
    }
    this.metrics = {
      volume: 'L',
      dose: 'ml'
    }
    
    this.tanks = [{name:'punkhead', volume: 450}, {name:'gaorock', volume: 720}, {name:'gaorock1', volume: 300}];
    this.volume = 0;
  }

  // change units
  unitChange = (prop, value) => {
    if (prop === 'tank') {
      this.choose.opTank = value;
      this.metrics.volume = this.unit['2'][value<=1?0:1];
    }
    if (prop === 'custom') {
      this.choose.opCust = value;
      this.metrics.volume = this.unit['2'][value];
    }
    if (prop === 'amount' || prop === 'quantity') {
      this.dose[prop].unit = value;
      // this.metrics.dose = this.unit['1'][value];
    }
    this.reslut = null;
    this.forceUpdate();
    console.log(this.choose.opTank)
  }

  // change main tank values
  onValueChange = (prop, ca, value) => {
    if (prop === 'main') this.data[ca] = value>0?value: 0;
    if (prop === 'sump') this.sump[ca] = value>0?value: 0;
    if (prop === 'dose') this.dose[ca].value= value>0?value: 0; 
    this.reslut = null;
    this.forceUpdate();
  }
  // change Custom water volume
  onVolumeChange = (value) => {
    this.volume = value;
    this.reslut = null;
    this.forceUpdate();
  }

  // page option change
  onChange = (value) => {
    this.choose.opMain = value;
    this.reslut = null;
    this.choose.opCust = 0;
    this.choose.opTank = 0;
    this.forceUpdate();
  }
  // render main select options
  renderDiff = () => {
    if (this.choose.opMain === 0) {
      const tank = (this.data.length * this.data.width * this.data.depth) * Math.pow(this.factor['2'][this.choose.opTank], 3)/1000000;
      let sump = (this.sump.length * this.sump.width * this.sump.depth) * Math.pow(this.factor['2'][this.choose.opTank], 3)/1000000;
      if (this.sump.length <=0 || this.sump.width <=0 || this.sump.height <=0 || this.sump.depth<=0) sump = 0;
      this.volume = this.round(tank+sump, 2);
      return this.renderOpt1();
    }
    if (this.choose.opMain === 1) {
      // this.volume = 0;
      return this.renderOpt2();
    }
    if (this.choose.opMain > 1) {
      this.volume = this.tanks[this.choose.opMain - 2].volume;
      this.metrics.volume = ' L';
      return this.renderOpt3();
    }
  }
  

  renderOptions = () => {
    let options = ['自定义尺寸', '自定义水体'];
    for (let i=0;i<this.tanks.length;i++) {
      options.push(this.tanks[i].name);
    }
    return options;
  }
  

  onClick = () => {
    if (this.data.length <=0 || this.data.width <=0 || this.data.height <=0 || this.data.depth<=0) return;
    if (this.data.depth > this.data.height || this.sump.depth > this.sump.height) return;
    if (window.localStorage) {
      window.localStorage.setItem('calc', JSON.stringify(this.data));
    }
    if (this.dose.quantity.value <=0 || this.dose.amount.value <=0) return;
    this.case = 0;
    if ((this.choose.opCust === 0 && this.choose.opMain === 1) || (this.choose.opTank <= 1 && this.choose.opMain === 0) || this.choose.opMain > 1) { // L
      if (this.dose.quantity.unit === 1) this.case = 1;
      if (this.dose.quantity.unit === 2) this.case = 2;
    } else if ((this.choose.opCust === 1 && this.choose.opMain === 1) || (this.choose.opTank > 1 && this.choose.opMain === 0)) { // us gal
      if (this.dose.quantity.unit === 0) this.case = 3;
      if (this.dose.quantity.unit === 2) this.case = 4;
    } else if (this.choose.opCust === 2 && this.choose.opMain === 1) { // uk gal
      if (this.dose.quantity.unit === 0) this.case = 5;
      if (this.dose.quantity.unit === 1) this.case = 6;
    } 
    this.per = this.dose.amount.value / (this.dose.quantity.value * this.factor['1'][this.case]);
    this.reslut = this.round(this.per * this.volume, 2) + ' ' + this.unit['1'][this.dose.amount.unit];
    this.forceUpdate();
  }

  round = (value, place = 0) => {
    return Math.round(value * Math.pow(10, place)) / Math.pow(10, place);
  }

  renderOpt1 = () => {
    return (
      <div>
        <Input label="主缸长度" defaultValue={this.data.length} onBlur={this.onValueChange.bind(this, 'main', 'length')} type="number" tag={this.unit['3']} defaultOp={this.choose.opTank} onChangeUnit={this.unitChange.bind(this, 'tank')}/>
        <Input label="主缸宽度" defaultValue={this.data.width} onBlur={this.onValueChange.bind(this, 'main', 'width')} type="number" tag={this.unit['3']} defaultOp={this.choose.opTank} onChangeUnit={this.unitChange.bind(this, 'tank')}/>
        <Input label="主缸高度" defaultValue={this.data.height} onBlur={this.onValueChange.bind(this, 'main', 'height')} type="number"  tag={this.unit['3']} defaultOp={this.choose.opTank} onChangeUnit={this.unitChange.bind(this, 'tank')}/>
        <Input label="主缸水深" defaultValue={this.data.depth} onBlur={this.onValueChange.bind(this, 'main', 'depth')} type="number"  tag={this.unit['3']} defaultOp={this.choose.opTank} onChangeUnit={this.unitChange.bind(this, 'tank')}/>
        <Input label="底缸长度（选填）" defaultValue={this.sump.length} onBlur={this.onValueChange.bind(this, 'sump', 'length')} type="number"  tag={this.unit['3']} defaultOp={this.choose.opTank} onChangeUnit={this.unitChange.bind(this, 'tank')}/>
        <Input label="底缸宽度（选填）" defaultValue={this.sump.width} onBlur={this.onValueChange.bind(this, 'sump', 'width')} type="number"  tag={this.unit['3']} defaultOp={this.choose.opTank} onChangeUnit={this.unitChange.bind(this, 'tank')}/>
        <Input label="底缸高度（选填）" defaultValue={this.sump.height} onBlur={this.onValueChange.bind(this, 'sump', 'height')} type="number"  tag={this.unit['3']} defaultOp={this.choose.opTank} onChangeUnit={this.unitChange.bind(this, 'tank')}/>
        <Input label="底缸水深（选填）" defaultValue={this.sump.depth} onBlur={this.onValueChange.bind(this, 'sump', 'depth')} type="number"  tag={this.unit['3']} defaultOp={this.choose.opTank} onChangeUnit={this.unitChange.bind(this, 'tank')}/>
      </div>
    )
  }
  renderOpt2 = () => {
    this.unitDisplayt = this.unit['2'][this.unit.choose1];
    return <Input label="目标水体" defaultValue={this.volume} onBlur={this.onVolumeChange} onChangeUnit={this.unitChange.bind(this, 'custom')} type="number" tag={this.unit['2']} defaultOp={this.choose.opCust}/>
  }
  renderOpt3 = () => {
    this.unitDisplay = ' L';
    return <Static label="目标水体" text={this.volume + ' L'}/>
  }

  renderResult = () => {
    if (!this.reslut) return '';
    return (
      <div className="result">
        <p><i className="fa fa-exclamation-triangle red"></i>
        本计算结果仅供参考，计算页面提供者不承担任何责任。</p>
        <Static label="目标水体：" text={this.volume+ ' ' +this.metrics.volume}/>
        <Static label="单位剂量：" text={this.round(this.per, 4)+ ' ' + this.unit['1'][this.dose.amount.unit]+'/'+this.metrics.volume}/>
        <Static label="药剂添加：" text={this.reslut}/>
      </div>
    )
  }

  render () {
    return (
      <div>
        <Select onChange={this.onChange} default={this.choose.opMain} options={this.renderOptions()} /> 
        {this.renderDiff()}
        <Input label="单位剂量" onBlur={this.onValueChange.bind(this, 'dose', 'amount')} onChangeUnit={this.unitChange.bind(this, 'amount')} type="number" tag={this.unit['1']} defaultOp={this.dose.amount.unit} placeholder="例：推荐剂量5ml / 76L, 此处填5"/>
        <Input label="单位容积" onBlur={this.onValueChange.bind(this, 'dose', 'quantity')} onChangeUnit={this.unitChange.bind(this, 'quantity')} type="number" tag={this.unit['2']} defaultOp={this.dose.quantity.unit} placeholder="例：推荐剂量5ml / 76L, 此处填76" />
        <Save onClick={this.onClick} label="计算" />
        {this.renderResult()}
      </div>  
    )
  }
}