import React, { PureComponent } from 'react';
import Page from '../../../components/page';
import Upload from '../../../components/upload';
import sortNum from '../../../helper/formatNumber';
import Select from '../../../components/forms/select';
// import Video from '../../../components/video';
import Graph from '../../../components/graph';
import utils from '../../../helper/utils';
import {connect} from 'react-redux';
import * as actions from '../../../redux/actions';
import cuid from 'cuid';
import Addlife from './addLife';
import Addgear from './addGear';
import Addalarm from './addAlarm';
import Addnote from './addNote';
import Addtest from './addTest';



class TankView extends PureComponent {
  constructor (props) {
    super(props);
    this.graph = 0;
    this.data1 = [
      {
        day: 1,
        value: 101
      },
      {
        day: 2,
        value: 191
      },
      {
        day: 3,
        value: 113
      },
      {
        day: 4,
        value: 144
      },
      {
        day: 5,
        value: 126
      },
      {
        day: 6,
        value: 117
      },
      {
        day: 7,
        value: 189
      }
    ]
    this.data = {
      '123': {
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
    }
    this.life = {
      fish: {
        '小丑': 4,
        '蓝吊': 2,
        '黄金吊': 3
      },
      coral: {
        '皮革': 1,
        '九尾狐': 1,
        '紫皮草皮': 1,
        '椰壳星花': 1,
        '荧光绿地毯': 1,
        '红病毒': 1
      },
      cuc: {
        '医生虾': 2,
        '食藻螺': 12,
        '海参': 1
      },
      algee: {
        '羽毛藻': 1,
        '绿葡萄藻': 1
      },
      other: {
        '绿葡萄藻': 1,
        '红葡萄藻': 2
      }
    }
    this.gear = {
      light: {
        'maxspact': 1
      },
      pump: {
        '中科世纪 2000L': 2,
        '中科世纪 3000L': 1
      },
      wave: {
        'Jinbo': 1
      },
      skimmer: {
        'nova 500L': 1
      },
      heater: {
        '500w': 1
      },
      cooler: { 
        '500W': 1
      },
      reactor: {
        '两只小鱼250': 1,
        '两只小鱼500': 1
      },
      filter: {
        '神砖 2': 1,
        '神砖 1': 2,
      },
      other: {

      }
    }
  }

  addTest = () => {
    this.data1.push({
      day: this.data1.length+1,
      value: utils.range(100, 190)
    });
    this.forceUpdate();
  }

  renderPara = () => {
    const l = ['Temp', 'PH', 'KH', 'NH3', 'NO2', 'NO3', 'PO4', 'Ca', 'Mg', 'Cu'];
    return l;
  }

  /* livestock */ 
  renderLife = (name) => {
    return Object.keys(this.life[name]).map((key) => {
      return <span key={cuid()}>{key}<i className="fa fa-times"></i>{this.life[name][key]}</span>
    })
  }
  /* gears */ 
  renderGear = (name) => {
    return Object.keys(this.gear[name]).map((key) => {
      return <span key={cuid()}>{key}<i className="fa fa-times"></i>{this.gear[name][key]}</span>
    })
  }

  /* add forms */
  renderAdd = () => {
    switch(this.props.page.edit) {
      case 'life':
        return <Addlife onSave={(data) => console.log(data)}/>
      case 'gear':
        return <Addgear onSave={(data) => console.log(data)}/>;
      case 'alarm':
        return <Addalarm onSave={(data) => console.log(data)}/>;
      case 'note':
        return <Addnote onSave={(data) => console.log(data)}/>;
      case 'test':
        return <Addtest onSave={(data) => console.log(data)}/>;
      default:
        return '';
    }
  }

  onGraphChange = (value) => {
    console.log(value);
    this.graph = value;
    this.forceUpdate();
  }

  render () {
    const tank = this.data[this.props.match.params.id] || null;
    
    if (!tank) return (
      <Page wapper={true}>
        没有找到
      </Page>
    )
    return (
      <Page wapper={true}>
        {this.renderAdd()}
        <section className="tank-view">
          <div className="tank-title">
            <h3>封面照片：</h3>
          </div>
          <Upload id="cover" className="tank-cover" color="#111">更换封面</Upload>
        </section>
        <section className="tank-view">
          <div className="tank-title">
            <h3>基本信息：</h3>
          </div>
          <div className="tank-info">
            <h5>名称：{tank.name}</h5>
            <h5>类型：{tank.tank?'海水':'淡水'}</h5>
            <h5>功能：{utils.getType(tank.type)}</h5>
            <h5>生物：{utils.getLife(tank.life)}</h5>
            <h5>容积：{tank.vol}L</h5>
            <h5>运行状态：{tank.status?'运行中':'停止'}</h5>
            <h5>笔记：{tank.note}篇</h5>
            <h5>观看：{sortNum(tank.view)}次</h5>
            <h5>点赞：{sortNum(tank.like)}次</h5>
            <h5>运行时间：{tank.run}天</h5>
            <h5>最后测试：{tank.last}天前</h5>
            <h5>公开展示：{tank.show?'是':'否'}</h5>
          </div>
        </section>
        
        <section className="tank-view">
          <div className="tank-title">
            <h3>
              水质数据：
              <Select options={this.renderPara()} className="para" default={this.graph} onChange={this.onGraphChange}/>
            </h3>
            <span>
              <a onClick={this.props.set_edit_page.bind(this, 'test')}><i className="fa fa-plus"></i></a>
            </span>
          </div>
          <Graph className="tank-chart" data={this.data1}/>
        </section>
        <section className="tank-view">
          <div className="tank-title">
            <h3>生物统计：</h3>
            <span>
              <a onClick={this.props.set_edit_page.bind(this, 'life')}><i className="fa fa-plus"></i></a>
            </span>
          </div>
          <div className="tank-details">
            <div className="cate-hover pointer">
              <h3>鱼类: </h3>
              {this.renderLife('fish')}
            </div>
            <div className="cate-hover pointer">
              <h3>珊瑚：</h3>
              {this.renderLife('coral')}
            </div>
            <div className="cate-hover pointer">
              <h3>清洁类：</h3>
              {this.renderLife('cuc')}
            </div>
            <div className="cate-hover pointer">
              <h3>藻类：</h3>
              {this.renderLife('algee')}
            </div>
            <div className="cate-hover pointer">
              <h3>其他：</h3>
              {this.renderLife('other')}
            </div>
          </div>
        </section>
        <section className="tank-view">
          <div className="tank-title">
            <h3>设备统计：</h3>
            <span>
              <a onClick={this.props.set_edit_page.bind(this, 'gear')}><i className="fa fa-plus"></i></a>
            </span>
          </div>
          <div className="tank-details">
            <div className="cate-hover pointer">
              <h3>灯具: </h3>
              {this.renderGear('light')}
            </div>
            <div className="cate-hover pointer">
              <h3>水泵：</h3>
              {this.renderGear('pump')}
            </div>
            <div className="cate-hover pointer">
              <h3>造浪：</h3>
              {this.renderGear('wave')}
            </div>
            <div className="cate-hover pointer">
              <h3>蛋分：</h3>
              {this.renderGear('skimmer')}
            </div>
            <div className="cate-hover pointer">
              <h3>加热：</h3>
              {this.renderGear('heater')}
            </div>
            <div className="cate-hover pointer">
              <h3>制冷：</h3>
              {this.renderGear('cooler')}
            </div>
            <div className="cate-hover pointer">
              <h3>反应器：</h3>
              {this.renderGear('reactor')}
            </div>
            <div className="cate-hover pointer">
              <h3>滤材：</h3>
              {this.renderGear('filter')}
            </div>
            <div className="cate-hover pointer">
              <h3>其他：</h3>
              {this.renderGear('other')}
            </div>
          </div>
        </section>
        <section className="tank-view">
          <div className="tank-title">
            <h3>计划提醒：</h3>
            <span>
              <a onClick={this.props.set_edit_page.bind(this, 'alarm')}><i className="fa fa-plus"></i></a>
            </span>
          </div>
          <div>
            <div className="tank-schedule">
              <span>11/3/2017</span>
              <span>12:00</span>
              <span>akls jkssdkjh ajkh  kjh</span>
              <span><i className="fa fa-clock-o"></i></span>
              <span className="pointer"><i className="fa fa-toggle-on green"></i></span>
            </div>
            <div className="tank-schedule">
              <span>11/3/2017</span>
              <span>12:00</span>
              <span>akls jkssdkjh ajkh  kjh</span>
              <span><i className="fa fa-retweet"></i></span>
              <span className="pointer"><i className="fa fa-toggle-off red"></i></span>
            </div>
          </div>
        </section>
        <section className="tank-view">
          <div className="tank-title">
            <h3>笔记：</h3>
            <span>
              <a onClick={this.props.set_edit_page.bind(this, 'note')}><i className="fa fa-plus"></i></a>
            </span>
          </div>
          <div>
            <div className="tank-note">
              <span>11/3/2017</span>
              <span>我今天买了几条鱼</span>
            </div>
            <div className="tank-note">
              <span>11/3/2017</span>
              <span>我今天买了几条鱼</span>
            </div>
            <div className="tank-note">
              <span>11/3/2017</span>
              <span>我今天买了几条鱼</span>
            </div>
          </div>
        </section>
        
      </Page>
    )
  }
}

export default connect(state => state, actions)(TankView);