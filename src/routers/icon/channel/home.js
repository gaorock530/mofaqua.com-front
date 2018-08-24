import React, { PureComponent } from 'react';

import Vlog from './vlog';
import Playlist from './playlist';
import Post from './post';
import Tank from './tank';
import Second from './second';

class Home extends PureComponent {

  render () {
    return (
      <div>
        <Vlog num={5} title="最新视频"/>
        <Playlist num={5}/>
        <Post num={5} />
        <Tank num={5} title="美缸档案"/>
        <Second num={5} />
      </div>
    )
  }
}

export default Home;