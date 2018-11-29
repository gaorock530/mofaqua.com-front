import React, {PureComponent} from 'react';
// import { connect } from 'react-redux';

import Section from './section';
// import * as actions from '../redux/actions';



class Home extends PureComponent {
  // componentWillUpdate () {
  //   // console.log('update home');
  // }
  // shouldComponentUpdate () {
  //   return false;
  // }
  // // ws = this.props.ws.connection;
  

  render () {
    return (
      <div className="app-body noselect">
        <section className="header-mask"></section> 
        <Section cover="0.7" url="/pic/reef-2.jpg" className="section-s1">
          <div className="sec-text">
            <div className="sec-text-title">Reef Magic 海魔法</div>
            <div className="sec-text-subtitle">
              <span>All About Enjoy Aquarium!</span>
              <span>Best Salt Water Aquarium App!</span>
              <span>Best Fresh Water Aquarium App!</span>
            </div>
            <div className="sec-text-download">
              <img src="/pic/available_app_store-1.png" alt="ios"/>
              <img src="/pic/google_play.png" alt="android"/>
            </div>
          </div>
          <div className="sec-pic">
            <img src="/pic/phone.png" alt="app"/>
          </div>
        </Section>
        <section className="chasingcoral">
          <div className="content">
            <div className="logo"></div>
            <div className="awards">
              <div style={{backgroundImage: 'url("/pic/chasingcoral/laurels_01.png")'}}></div>
              <div style={{backgroundImage: 'url("/pic/chasingcoral/laurels_02.png")'}}></div>
              <div style={{backgroundImage: 'url("/pic/chasingcoral/laurels_03.png")'}}></div>
              <div style={{backgroundImage: 'url("/pic/chasingcoral/laurels_04.png")'}}></div>
              <div style={{backgroundImage: 'url("/pic/chasingcoral/laurels_05.png")'}}></div>
              <div style={{backgroundImage: 'url("/pic/chasingcoral/laurels_06.png")'}}></div>
              <div style={{backgroundImage: 'url("/pic/chasingcoral/laurels_07.png")'}}></div>
            </div>
            <div className="play">
              <i className="fa fa-play-circle"></i>
            </div>
          </div>
          <div className="cover"></div>
          <video src="/video/chasingcoral.mp4" preload="true" autoPlay loop poster="/pic/chasingcoral/chasingcoralherobanner-736x414.jpg"></video>
        </section>
        <Section cover="0.7" url="/pic/reef-3.jpg" className="section-s1">
          
          <div className="sec-pic sec-swap">
            <img src="/pic/phone.png" alt="app"/>
          </div>
          <div className="sec-text">
            <div className="sec-text-title">reef aquarium 论坛</div>
            <div className="sec-text-subtitle">
              <span>All About Enjoy Aquarium!</span>
              <span>Best Salt Water Aquarium App!</span>
              <span>Best Fresh Water Aquarium App!</span>
            </div>
          </div>
        </Section>
        <Section cover="0.7" url="/pic/reef-4.jpg" className="section-s1">
          <div className="sec-text">
            <div className="sec-text-title">Record reef Data</div>
            <div className="sec-text-subtitle">
              <span>All About Enjoy Aquarium!</span>
              <span>Best Salt Water Aquarium App!</span>
              <span>Best Fresh Water Aquarium App!</span>
            </div>
          </div>
          <div className="sec-pic">
            <img src="/pic/phone.png" alt="app"/>
          </div>
        </Section>
        <Section cover="0.7" url="/pic/reef-5.jpg" className="section-s1">
          <div className="sec-pic sec-swap">
            <img src="/pic/phone.png" alt="app"/>
          </div>
          <div className="sec-text">
            <div className="sec-text-title">买卖交易</div>
            <div className="sec-text-subtitle">
              <span>All About Enjoy Aquarium!</span>
              <span>Best Salt Water Aquarium App!</span>
              <span>Best Fresh Water Aquarium App!</span>
            </div>
          </div>
        </Section>
        <Section cover="0.7" url="/pic/reef-2.jpg" className="section-s1">
          <div className="sec-text">
            <div className="sec-text-title">realtime communication</div>
            <div className="sec-text-subtitle">
              <span>All About Enjoy Aquarium!</span>
            </div>
          </div>
          <div className="sec-pic">
            <img src="/pic/phone.png" alt="app"/>
          </div>
        </Section>
        <Section cover="0.7" url="/pic/reef-3.jpg" className="section-s1">
          <div className="sec-pic sec-swap">
            <img src="/pic/phone.png" alt="app"/>
          </div>
          <div className="sec-text">
            <div className="sec-text-title">AI photo recognition</div>
            <div className="sec-text-subtitle">
              <span>All About Enjoy Aquarium!</span>
              <span>Best Salt Water Aquarium App!</span>
            </div>
          </div>
        </Section>
        
      </div>
    )
  }
}

// export default connect(null, null)(Home);
export default Home;