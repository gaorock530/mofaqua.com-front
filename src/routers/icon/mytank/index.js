import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import { connect } from 'react-redux';
import cuid from 'cuid';
import * as actions from '../../../redux/actions';
import Page from '../../../components/page';
import sortNum from '../../../helper/formatNumber';

class Mytank extends Component {
  componentDidUpdate () {
    console.log('asdasd')
  }
  shouldComponentUpdate () {
    return false;
  }
  fakeData = [
    {
      name: 'Punkhead',
      pic: '/pic/reef-4.jpg',
      tank: true,// true-海水 false-淡水
      type: 1,// 1-展示 2-检疫 3-隔离 4-繁殖 5-Frag
      life: 1,// 1-FOT 2-NPS 3-LPS 4-SPS 5-MIX
              // 1-Single 2-Mixed
      vol: '500',
      run: '300',
      last: 10,
      status: true,// 0-运行中 1-停止 
      note: 5,
      view: '123456',
      like: '1200',
      show: true,
      parameter: {
        'Temp': '26',
        'PH': '8',
        'KH': '7.5',
        'NH3': '0.1',
        'NO2': '0.5',
        'NO3': '15',
        'PO4': '0.05',
        'Ca': '1000',
        'Mg': '300',
        'Cu': '0.5'
      }
    },
    {
      name: 'Magic',
      pic: '/pic/reef-3.jpg',
      tank: true,// true-海水 false-淡水
      type: 1,// 1-展示 2-检疫 3-隔离 4-繁殖 5-Frag
      life: 1,// 1-FOT 2-NPS 3-LPS 4-SPS 5-MIX
              // 1-Single 2-Mixed
      vol: '500',
      run: '300',
      last: 10,
      status: true,// 0-运行中 1-停止 
      note: 5,
      view: '1200456',
      like: '12200',
      show: true,
      parameter: {
        'Temp': '28',
        'PH': '8.5',
        'KH': '7',
        'NH3': '0.3',
        'NO2': '0.2',
        'NO3': '30',
        'PO4': '0.1',
        'Ca': '300',
        'Mg': '1400',
        'Cu': '0.01'
      }
    },
    {
      name: '海蓝',
      pic: '/pic/reef-2.jpg',
      tank: true,// true-海水 false-淡水
      type: 2,// 1-展示 2-检疫 3-隔离 4-繁殖 5-Frag
      life: 1,// 1-FOT 2-Anemone 3-LPS 4-SPS 5-MIX
              // 1-Single 2-Mixed
      vol: '200',
      run: '1300',
      last: 10,
      status: true,// 0-运行中 1-停止 
      note: 5,
      view: '12056345',
      like: '1202023',
      show: true,
      parameter: {
        'Temp': '27',
        'PH': '7.7',
        'KH': '7',
        'NH3': '0.2',
        'NO2': '0.1',
        'NO3': '20',
        'PO4': '0.1',
        'Ca': '400',
        'Mg': '1200',
        'Cu': '0.2'
      }
    },
    {
      name: '海蓝',
      pic: '/pic/reef-2.jpg',
      tank: true,// true-海水 false-淡水
      type: 5,// 1-展示 2-检疫 3-隔离 4-繁殖 5-Frag
      life: 5,// 1-FOT 2-NPS 3-LPS 4-SPS 5-MIX
              // 1-Single 2-Mixed
      vol: '500',
      run: '0',
      last: 0,
      status: false,// 0-运行中 1-停止 
      note: 0,
      view: '0',
      like: '0',
      show: false,
      parameter: {
        'null': 'null'
      }
    }
  ];

  getType = (num) => {
    switch (num) {
      case 1:
        return '展示';
      case 2:
        return '检疫';
      case 3:
        return '隔离';
      case 4:
        return '繁殖';
      case 5:
        return 'Frag';
      default:
        return '展示';
    }
  }

  getLife = (t, num) => {
    if (t) {
      switch (num) {
        case 1:
          return 'FOT';
        case 2:
          return 'NPS';
        case 3:
          return 'LPS';
        case 4:
          return 'SPS';
        case 5:
          return 'MIX';
        default:
          return 'MIX';
      }
    } else {
      if (num === 1) {
        return 'Single';
      }else {
        return 'Mixed';
      }
    }
  }

  getUnit = (t) => {
    if (t === 'Temp') return '°C';
    if (t === 'KH' || t === 'PH') return '';
    return 'ppm';
  }

  getColor = (k, v) => {
    const color = ['b-green', 'b-greenyellow', 'b-orange', 'b-red'];
    switch (k) {
      case 'Temp':
        if (v<=28 && v>=24) return color[0];
        if ((v<25 && v>=24) || (v>28 && v<=29)) return color[1];
        if ((v<24 && v>=23) || (v>29 && v<=30)) return color[2];
        if (v<23 || v>30) return color[3];
        return color[0];
      case 'PH':
        if (v<=8.3 && v>=8.1) return color[0];
        if ((v<8.1 && v>=7.8) || (v>8.3 && v<=8.5)) return color[1];
        if ((v<7.8 && v>=7.5) || (v>8.5 && v<=8.7)) return color[2];
        if (v<7.5 || v>8.7) return color[3];
        return color[0];
      case 'KH':
        if (v<=10 && v>=7) return color[0];
        if ((v<7 && v>=6.8) || (v>10 && v<=10.5)) return color[1];
        if ((v<6.8 && v>=6) || (v>10.5 && v<=11.5)) return color[2];
        if (v<6 || v>11.5) return color[3];
        return color[0];
      case 'NH3':
        if (v<=0.1) return color[0];
        if (v<=0.2 && v>0.1) return color[1];
        if (v<=0.4 && v>0.2) return color[2];
        if (v>0.4) return color[3];
        return color[0];
      case 'NO2':
        if (v<=0.05) return color[0];
        if (v<=0.2 && v>0.05) return color[1];
        if (v<=0.3 && v>0.2) return color[2];
        if (v>0.3) return color[3];
        return color[0];
      case 'NO3':
        if (v<=10) return color[0];
        if (v<=30 && v>10) return color[1];
        if (v<=50 && v>30) return color[2];
        if (v>50) return color[3];
        return color[0];
      case 'PO4':
        if (v<=0.1) return color[0];
        if (v<=0.2 && v>0.1) return color[1];
        if (v<=0.4 && v>0.2) return color[2];
        if (v>0.4) return color[3];
        return color[0];
      case 'Ca':
        if (v<=450 && v>=380) return color[0];
        if ((v<380 && v>=360) || (v>450 && v<=470)) return color[1];
        if ((v<360 && v>=330) || (v>470 && v<=500)) return color[2];
        if (v<330 || v>500) return color[3];
        return color[0];
      case 'Mg':
        if (v<=1350 && v>=1250) return color[0];
        if ((v<1250 && v>=1200) || (v>1350 && v<=1400)) return color[1];
        if ((v<1200 && v>=1100) || (v>1400 && v<=1500)) return color[2];
        if (v<1100 || v>1500) return color[3];
        return color[0];
      case 'Cu':
        if (v<0.1) return color[0];
        if (v<=0.5 && v>=0.1) return color[1];
        if (v<0.8 && v>0.5) return color[2];
        if (v>=0.8) return color[3];
        return color[0];
      default:
        return '';
    }
  } 

  renderTank = () => {
    return this.fakeData.map(tank =>{
      return (
        <div className="tank-item" key={cuid()}>
          <Link to="/mytank/123"><div className={tank.status?"tank-item-left":"tank-item-left tank-stop"} style={{'backgroundImage': 'url('+tank.pic+')'}}></div></Link>
          <div className="tank-item-right">
            <div>
              <h5>名称：{tank.name}</h5>
              <h5>类型：{tank.tank?'海水':'淡水'}</h5>
              <h5>功能：{this.getType(tank.type)}</h5>
              <h5>生物：{this.getLife(tank.life)}</h5>
              <h5>容积：{tank.vol}L</h5>
              <h5>运行状态：{tank.status?'运行中':'停止'}</h5>
            </div>
            <div>
              <h5>笔记：{tank.note}篇</h5>
              <h5>观看：{sortNum(tank.view)}次</h5>
              <h5>点赞：{sortNum(tank.like)}次</h5>
              <h5>运行时间：{tank.run}天</h5>
              <h5>最后测试：{tank.last}天前</h5>
              <h5>公开展示：{tank.show?'是':'否'}</h5>
            </div>
            <div className="tank-test">
              {Object.keys(tank.parameter).map(key => {
                if (key === 'null') return <div key={cuid()}>没有测试结果</div>;
                return (
                  <div key={cuid()}>{key}：{tank.parameter[key]} {this.getUnit(key)}<label className={this.getColor(key, tank.parameter[key])}></label></div>
                ) 
              })}
            </div>
          </div>
        </div>
      )
    })
  }

  render () {
    return (
      <Page wapper={true}>
        <div className="tank-nav">
          <div className="tank-nav-left">
            <h2>我的鱼缸</h2>
            <label>数量: <span>{this.fakeData.length}</span></label>
          </div>
          <div className="tank-nav-right">
            <Link to="/addtank" title="添加新鱼缸"><i className="fa fa-plus"></i></Link>
          </div>
        </div>
        <div className="tank-list">
          {this.renderTank()}
        </div>
      </Page>
    )
  }
}

export default connect(state => state, actions)(Mytank);