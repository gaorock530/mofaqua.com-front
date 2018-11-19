import React, { PureComponent } from 'react';
import { connect } from 'react-redux'; 
import cuid from 'cuid';
import word from '../../../helper/wordcounter';
import LazyLoad from '../../../components/lazyload';
import * as actions from '../../../redux/actions';
// import Note from '../../../components/note';

class Tank extends PureComponent {
  fakeDate = [
    {
      id: cuid(),
      pic: '/pic/reef-5.jpg',
      title: 'asl :dkja',
      view: 1000,
      like: 123,
      date: 3,
      show: true
    },
    {
      id: cuid(),
      pic: '/pic/reef-1.jpg',
      title: 'Week 51: What you need to know to cure fish disease & 123阿斯顿看家',
      view: 300,
      like: 123,
      date: 3,
      show: true
    },
    {
      id: cuid(),
      pic: '/pic/reef-2.jpg',
      title: 'Livestream: Clean Up Crew your reef!',
      view: 122000,
      like: 123,
      date: 3,
      show: true
    },
    {
      id: cuid(),
      pic: '/pic/reef-3.jpg',
      title: '我asked多久asdas阿克索德看见啊上地理课离开12312 askdkj啊 省度啊',
      view: 1300,
      like: 123,
      date: 3,
      show: true
    },
    {
      id: cuid(),
      pic: '/pic/reef-4.jpg',
      title: '一二三四五六七八九十一二三四123123五六七八九十一二三四五六七八九十',
      view: 4000,
      like: 123,
      date: 3,
      show: true
    },
    {
      id: cuid(),
      pic: '/pic/reef-5.jpg',
      title: 'asldkja阿斯科利多久卢卡斯简单  阿斯科利多久啊锶度1-332阿克琉斯多久',
      view: 300,
      like: 123,
      date: 3,
      show: true
    },
  ];

  renderList = (data) => {
    return data.map((o) => {
      const newT = word(o.title, true, true, 2, 51);
      
      return (
        <a key={o.id} title={o.title} className="single">
          <div className="cover">
            <div style={{'backgroundImage': 'url('+o.pic+')'}}></div>
            <span onClick={this.props.update_lazyload.bind(this, 'tank', o.id, {show: !o.show})}><i className={`fa fa-toggle-${o.show?'on':'off'}`}></i></span>
          </div>
          
          <div className="description">
            <p>{newT}</p>
            <div className="status">
              <label>{o.view}次观看</label>
              <span>{o.like}人喜欢</span>
            </div>
          </div>
        </a>
      )
    })
  }
  render () {
    const { title } = this.props;
    return (
      <div className="channel-wrapper">
        <section className="channel-section">
          <h1>{title?title:'美缸档案'}<span>{this.fakeDate.length}</span></h1>
          <div className="utility">
            <i className="fa fa-toggle-on"></i>快速展示/隐藏
          </div>

          <LazyLoad className="sec-list" renderList={this.renderList} data={this.fakeDate} tab="tank" fresh={true}/>

        </section>
      </div>
    )
  }
}

export default connect(state => state, actions)(Tank);