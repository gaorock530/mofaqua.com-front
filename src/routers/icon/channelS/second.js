import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../../../redux/actions';
import cuid from 'cuid';
import word from '../../../helper/wordcounter';

class Second extends PureComponent {
  componentWillUnmount () {
    this.props.set_edit_page(null);
  }

  fakeDate = [
    {
      id: cuid(),
      pic: '/pic/reef-5.jpg',
      title: 'asl :dkja',
      view: 1000,
      date: 3
    },
    {
      id: cuid(),
      pic: '/pic/reef-1.jpg',
      title: 'Week 51: What you need to know to cure fish disease & 123阿斯顿看家',
      view: 300,
      date: 3
    },
    {
      id: cuid(),
      pic: '/pic/reef-2.jpg',
      title: 'Livestream: Clean Up Crew your reef!',
      view: 122000,
      date: 3
    },
    {
      id: cuid(),
      pic: '/pic/reef-3.jpg',
      title: '我asked多久asdas阿克索德看见啊上地理课离开12312 askdkj啊 省度啊',
      view: 1300,
      date: 3
    },
    {
      id: cuid(),
      pic: '/pic/reef-4.jpg',
      title: '一二三四五六七八九十一二三四123123五六七八九十一二三四五六七八九十',
      view: 4000,
      date: 3
    },
    {
      id: cuid(),
      pic: '/pic/reef-5.jpg',
      title: 'asldkja阿斯科利多久卢卡斯简单  阿斯科利多久啊锶度1-332阿克琉斯多久',
      view: 300,
      date: 3
    },
  ];

  renderList = () => {
    return this.fakeDate.map((o) => {
      const newT = word(o.title, true, true, 2, 51);
      
      
      return (
        <Link to={"/edit/second/" + o.id} key={o.id} title={o.title} className="single">
          <div className="cover">
            <div style={{'backgroundImage': 'url('+o.pic+')'}}></div>
            <span>5:30</span>
          </div>
          
          <div className="description">
            <p>{newT}</p>
            <div className="status">
              <label>{o.view}次观看</label>
              <span>{o.date}个月前</span>
            </div>
          </div>
        </Link>
      )
    })
  }
  render () {
    const { num = 5, title } = this.props;
    return (
      <div className="channel-wrapper">
        <section className="channel-section">
          <h1>{title?title:'二手闲置'}<span>{this.fakeDate.length}</span></h1>
          <div className="utility">
            <Link to="/add/second"><i className="fa fa-recycle"></i>发布二手信息</Link>
          </div>
          <div className="sec-list">
            {this.renderList(num)}
          </div>
        </section>
      </div>
    )
  }
}

export default connect(({page}) => ({page}), actions)(Second);