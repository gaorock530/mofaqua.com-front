import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import cuid from 'cuid';
import word from '../../../helper/wordcounter';
import * as actions from '../../../redux/actions';
import LazyLoad from '../../../components/lazyload';
import sortNum from '../../../helper/formatNumber';
import sortTime from '../../../helper/formatTime';
import Edit from './edit-video';

class Vlog extends PureComponent {
  componentWillUnmount () {
    this.props.set_edit_page(null);
  }
  
  fakeDate = [
    {
      id: cuid(),
      pic: '/pic/reef-5.jpg',
      title: 'asl :dkja',
      view: 1000,
      date: 1529610515519
    },
    {
      id: cuid(),
      pic: '/pic/reef-1.jpg',
      title: 'Week 51: What you need to know to cure fish disease & 123阿斯顿看家',
      view: 300,
      date: 1529610515519 + 1000 * 60 * (60)
    },
    {
      id: cuid(),
      pic: '/pic/reef-2.jpg',
      title: 'Livestream: Clean Up Crew your reef!',
      view: 122000,
      date: 1525449600000
    },
    {
      id: cuid(),
      pic: '/pic/reef-3.jpg',
      title: '我asked多久asdas阿克索德看见啊上地理课离开12312 askdkj啊 省度啊',
      view: 1300,
      date: 1525622400000
    },
    {
      id: cuid(),
      pic: '/pic/reef-4.jpg',
      title: '一二三四五六七八九十一二三四123123五六七八九十一二三四五六七八九十',
      view: 4000,
      date: 1525881600000
    },
    {
      id: cuid(),
      pic: '/pic/reef-5.jpg',
      title: 'asldkja阿斯科利多久卢卡斯简单  阿斯科利多久啊锶度1-332阿克琉斯多久',
      view: 300,
      date: 1525104000000
    },
    {
      id: cuid(),
      pic: '/pic/reef-5.jpg',
      title: 'asl :dkja',
      view: 1000,
      date: 1526140800000
    },
    {
      id: cuid(),
      pic: '/pic/reef-1.jpg',
      title: 'Week 51: What you need to know to cure fish disease & 123阿斯顿看家',
      view: 300,
      date: 1527177600000
    },
    {
      id: cuid(),
      pic: '/pic/reef-2.jpg',
      title: 'Livestream: Clean Up Crew your reef!',
      view: 122000,
      date: 1527696000000
    },
    {
      id: cuid(),
      pic: '/pic/reef-3.jpg',
      title: '我asked多久asdas阿克索德看见啊上地理课离开12312 askdkj啊 省度啊',
      view: 1300,
      date: 1527091200000
    },
    {
      id: cuid(),
      pic: '/pic/reef-4.jpg',
      title: '一二三四五六七八九十一二三四123123五六七八九十一二三四五六七八九十',
      view: 4000,
      date: 1526400000000
    },
    {
      id: cuid(),
      pic: '/pic/reef-5.jpg',
      title: 'asldkja阿斯科利多久卢卡斯简单  阿斯科利多久啊锶度1-332阿克琉斯多久',
      view: 300,
      date: 1525881600000
    },
    {
      id: cuid(),
      pic: '/pic/reef-5.jpg',
      title: 'asl :dkja',
      view: 1000,
      date: 1526486400000
    },
    {
      id: cuid(),
      pic: '/pic/reef-1.jpg',
      title: 'Week 51: What you need to know to cure fish disease & 123阿斯顿看家',
      view: 300,
      date: 1525104000000
    },
    {
      id: cuid(),
      pic: '/pic/reef-2.jpg',
      title: 'Livestream: Clean Up Crew your reef!',
      view: 122000,
      date: 1526140800000
    },
    {
      id: cuid(),
      pic: '/pic/reef-3.jpg',
      title: '我asked多久asdas阿克索德看见啊上地理课离开12312 askdkj啊 省度啊',
      view: 1300,
      date: 1526832000000
    },
    {
      id: cuid(),
      pic: '/pic/reef-4.jpg',
      title: '一二三四五六七八九十一二三四123123五六七八九十一二三四五六七八九十',
      view: 4000,
      date: 1525276800000
    },
    {
      id: cuid(),
      pic: '/pic/reef-5.jpg',
      title: 'asldkja阿斯科利多久卢卡斯简单  阿斯科利多久啊锶度1-332阿克琉斯多久',
      view: 300,
      date: 1527004800000
    },
    {
      id: cuid(),
      pic: '/pic/reef-5.jpg',
      title: 'asl :dkja',
      view: 1000,
      date: 1526572800000
    },
    {
      id: cuid(),
      pic: '/pic/reef-1.jpg',
      title: 'Week 51: What you need to know to cure fish disease & 123阿斯顿看家',
      view: 300,
      date: 1525795200000
    },
    {
      id: cuid(),
      pic: '/pic/reef-2.jpg',
      title: 'Livestream: Clean Up Crew your reef!',
      view: 122000,
      date: 1526918400000
    },
    {
      id: cuid(),
      pic: '/pic/reef-3.jpg',
      title: '我asked多久asdas阿克索德看见啊上地理课离开12312 askdkj啊 省度啊',
      view: 1300,
      date: 1525536000000
    },
    {
      id: cuid(),
      pic: '/pic/reef-4.jpg',
      title: '一二三四五六七八九十一二三四123123五六七八九十一二三四五六七八九十',
      view: 4000,
      date: 1525708800000
    },
    {
      id: cuid(),
      pic: '/pic/reef-5.jpg',
      title: 'asldkja阿斯科利多久卢卡斯简单  阿斯科利多久啊锶度1-332阿克琉斯多久',
      view: 300,
      date: 1525795200000
    },
  ];

  renderList = (data) => {
    return data.map((o) => {
      const newT = word(o.title, true, true, 2, 51);
      return (
        <Link to={"/edit/video/" + o.id} key={o.id} title={o.title} className="single">
          <div className="cover">
            <div style={{'backgroundImage': 'url('+o.pic+')'}}></div>
            <span>5:30</span>
          </div>
          
          <div className="description">
            <p>{newT}</p>
            <div className="status">
              <label>{sortNum(o.view)}次观看</label>
              <span>{sortTime(o.date)}前</span>
            </div>
          </div>
        </Link>
      )
    })
  }
  
  render () {
    const { title, num} = this.props;
    return (
      <div className="channel-wrapper">
        <section className="channel-section">
          <h1>{title?title:'全部视频'}<span>{this.fakeDate.length}</span></h1>
          <div className="utility">
            <Link to="/add/video"><i className="fa fa-upload"></i>上传视频</Link>
          </div>

          <LazyLoad className="sec-list" renderList={this.renderList} num={num} data={this.fakeDate} tab="vlog" />

        </section>
      </div>
    )
  }
}

export default connect(state => state, actions)(Vlog);