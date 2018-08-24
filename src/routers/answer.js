import React, {Component} from 'react';
import WS from '../ws-api';

class Answer extends Component {

  list = () => {
    let list = [];
    for(let i in window.screen) {
      list.push(<p key={i}>{i+" : "+window.screen[i]}</p>)
    }
    return list;
  }

  render () {
    return (
      <div>
        <section className="header-mask"></section> 
        <div>Answer {WS.SUPPORT.toString()}</div>
        <p>{navigator.platform}</p>
        <p>{navigator.deviceMemory}</p>
        <p>{navigator.hardwareConcurrency}</p>
        <p>{navigator.product}</p>
        <p>{navigator.vendor}</p>
        <p>{navigator.connection? navigator.connection.downlink : null}</p>
        {this.list()}
      </div>
    )
  }
}

export default Answer;