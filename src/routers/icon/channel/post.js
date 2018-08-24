import React, { PureComponent } from 'react';
import cuid from 'cuid';
import word from '../../../helper/wordcounter';

class Post extends PureComponent {

  fakeDate = [
    {
      pic: '/pic/reef-5.jpg',
      title: 'asl :dkja',
      view: 1000,
      date: 3
    },
    {
      pic: '/pic/reef-1.jpg',
      title: 'Week 51: What you need to know to cure fish disease & 123阿斯顿看家',
      view: 300,
      date: 3
    },
    {
      pic: '/pic/reef-2.jpg',
      title: 'Livestream: Clean Up Crew your reef!',
      view: 122000,
      date: 3
    },
    {
      pic: '/pic/reef-3.jpg',
      title: '我asked多久asdas阿克索德看见啊上地理课离开12312 askdkj啊 省度啊',
      view: 1300,
      date: 3
    },
    {
      pic: '/pic/reef-4.jpg',
      title: '一二三四五六七八九十一二三四123123五六七八九十一二三四五六七八九十',
      view: 4000,
      date: 3
    },
    {
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
        <a key={cuid()} title={o.title}>
          <div className="cover">
            <div style={{'backgroundImage': 'url('+o.pic+')'}}></div>
            <span>5:30</span>
          </div>
          
          <div className="description">
            <p>{newT}</p>
            <div>
              <label>{o.view}次观看</label>
              <span>{o.date}个月前</span>
            </div>
          </div>
        </a>
      )
    })
  }
  render () {
    const { num = 5, title } = this.props;
    return (
      <div className="channel-wrapper">
        <section className="channel-section">
          <h1>{title?title:'经验分享'}</h1>
          <div className="sec-list">
            {this.renderList(num)}
          </div>
        </section>
      </div>
    )
  }
}

export default Post;