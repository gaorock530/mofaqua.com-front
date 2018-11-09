import React, {PureComponent} from 'react';
import Input from '../../components/forms/input';
import Save from '../../components/forms/save';
import Static from '../../components/forms/static';
import Select from '../../components/forms/select';

export default class Salt extends PureComponent {
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
    this.choose = {
      opMain: 0,  
      opTank: 0,
      opCust: 0
    };
    // all Units 
    this.unit = {
      2: ['L', 'us Gal', 'uk Gal'],
      3: ['mm', 'cm', 'inch', 'foot']
    }
    this.factor = {
      1: 33.3333333, //31.818181 g/l
      // mm, cm, inch, foot
      2: [0.000001, 0.001, 0.016387, 28.3168], // tank size
      // L, us Gal, uk Gal
      3: [1, 3.7854118, 4.5460919] // unit convert
    } // L
    this.metrics = 'L';

    // depend on different factors, stores a multiplier
    this.multi = 0.000001;
    
    this.tanks = [{name:'punkhead', volume: 450}, {name:'gaorock', volume: 720}, {name:'gaorock1', volume: 300}];
    
    this.volume = 0;
    this.result = null;
  }

  // change units
  unitChange = (prop, value) => {
    if (prop === 'tank') {
      this.choose.opTank = value;
      this.metrics = this.unit['2'][value<=1?0:1];
      this.multi = this.factor['2'][value];
    }
    if (prop === 'custom') {
      this.choose.opCust = value;
      this.metrics = this.unit['2'][value];
      this.multi = this.factor['3'][value];
    }
    this.reslut = null;
    this.forceUpdate();
  }

  // change main tank size values
  onValueChange = (prop, ca, value) => {
    if (prop === 'main') this.data[ca] = value>0?value: 0;
    if (prop === 'sump') this.sump[ca] = value>0?value: 0;
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
    this.choose.opCust = 0;
    this.choose.opTank = 0;
    this.metrics = this.unit['2'][0];
    if (this.choose.opMain === 0) this.multi = this.factor['2'][0];
    else this.multi = this.factor['3'][0];
    this.volume = 0;
    this.reslut = null;
    this.forceUpdate();
  }
  // render main select options
  renderDiff = () => {
    if (this.choose.opMain === 0) {
      return this.renderOpt1();
    }
    if (this.choose.opMain === 1) {
      return this.renderOpt2();
    }
    if (this.choose.opMain > 1) {
      this.volume = this.tanks[this.choose.opMain - 2].volume;
      this.metrics = 'L';
      return this.renderOpt3();
    }
  }
  
  // render page options includes personal tank preset
  renderOptions = () => {
    let options = ['自定义尺寸', '自定义水体'];
    let index = 2;
    for (let i=0;i<this.tanks.length;i++) {
      options.push(this.tanks[i].name);
      index++;
    }
    return options;
  }
  

  onClick = () => {
    if (this.choose.opMain === 0) {
      if (this.data.length <=0 || this.data.width <=0 || this.data.height <=0 || this.data.depth<=0) return;
      if (this.data.depth > this.data.height || this.sump.depth > this.sump.height) return;
      if (window.localStorage) {
        window.localStorage.setItem('calc', JSON.stringify(this.data));
      }
      const tank = (this.data.length * this.data.width * this.data.depth);
      const sump = (this.sump.length * this.sump.width * this.sump.depth);
      this.volume = tank + sump; 
      this.total = this.volume * this.multi; // L
      this.dose = this.factor['1'] * this.total;
      this.total = this.total / this.factor['3'][this.choose.opTank<=1?0:1];
    } else if (this.choose.opMain === 1) {
      if (this.volume < 0) return;
      this.total = this.volume; // whatever unit
      this.dose = this.factor['1'] * this.volume * this.multi; // kg/l
    } else {
      this.total = this.volume;
      this.dose = this.volume * 33.3333333;
    }
 
    
    if(Math.floor(this.dose).toString().length>3) {
      this.doseUnit = 'kg';
      this.dose = this.round(this.dose / 1000, 2);
    } else {
      this.doseUnit = 'g';
      this.dose = this.round(this.dose, 2);
    }
    this.reslut = this.dose + ' ' + this.doseUnit;
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
    return <Input label="目标水体" defaultValue={this.volume} onBlur={this.onVolumeChange} onChangeUnit={this.unitChange.bind(this, 'custom')} type="number" options={this.unit['2']} defaultOp={this.choose.opCust}/>
  }
  renderOpt3 = () => {
    return <Static label="目标水体" text={this.volume + ' L'}/>
  }

  renderResult = () => {
    if (!this.reslut) return '';
    return (
      <div className="result">
        <p><i className="fa fa-exclamation-triangle red"></i>
        本计算结果仅供参考，计算页面提供者不承担任何责任。盐度按照1.026配比。</p>
        <Static label="目标水体：" text={this.round(this.total, 2)+ ' ' +this.metrics}/>
        <Static label="海盐添加：" text={this.reslut}/>
      </div>
    )
  }
  // 22000g => 660L (175Gal)

  render () {
    return (
      <div>
        <Select onChange={this.onChange} default={this.choose.opMain} options={this.renderOptions()} /> 
        {this.renderDiff()}
        <Save onClick={this.onClick} text="计算" />
        {this.renderResult()}
      </div>  
    )
  }
}