import React from 'react';
import HLS from 'hls.js';

export default class VideoPlayer extends React.Component {
  componentDidMount() {
    console.log(HLS);
    if(HLS.isSupported()) {
      var hls = new HLS();
      hls.loadSource('https://video-dev.github.io/streams/x36xhzz/x36xhzz.m3u8');
      hls.attachMedia(this.videoNode);
      hls.on(HLS.Events.MANIFEST_PARSED,function() {
        this.videoNode.play();
    });
   }
   // hls.js is not supported on platforms that do not have Media Source Extensions (MSE) enabled.
   // When the browser has built-in HLS support (check using `canPlayType`), we can provide an HLS manifest (i.e. .m3u8 URL) directly to the video element throught the `src` property.
   // This is using the built-in support of the plain video element, without using hls.js.
   // Note: it would be more normal to wait on the 'canplay' event below however on Safari (where you are most likely to find built-in HLS support) the video.src URL must be on the user-driven
   // white-list before a 'canplay' event will be emitted; the last video event that can be reliably listened-for when the URL is not on the white-list is 'loadedmetadata'.
    else if (this.videoNode.canPlayType('application/vnd.apple.mpegurl')) {
      this.videoNode.src = 'https://video-dev.github.io/streams/x36xhzz/x36xhzz.m3u8';
      this.videoNode.addEventListener('loadedmetadata',function() {
        this.videoNode.play();
      });
    }
  }

  // destroy player on unmount
  componentWillUnmount() {
    
  }

  render() {
    return (
      <div>    
        <div>
          <video ref={ node => this.videoNode = node } className="video-js"></video>
        </div>
      </div>
    )
  }
}


// import React from 'react';
// import videojs from 'video.js'
// // import 'videojs-contrib-hls';
// import 'video.js/dist/video-js.min.css';
// window.videojs = videojs;
// require('videojs-contrib-hls/dist/videojs-contrib-hls.js');

// export default class VideoPlayer extends React.Component {
//   componentDidMount() {
//     // instantiate Video.js
//     this.player = videojs(this.videoNode, this.props, function onPlayerReady() {
//       console.log('onPlayerReady', this)
//     });
//   }

//   // destroy player on unmount
//   componentWillUnmount() {
//     if (this.player) {
//       this.player.dispose()
//     }
//   }

//   // wrap the player in a div with a `data-vjs-player` attribute
//   // so videojs won't create additional wrapper in the DOM
//   // see https://github.com/videojs/video.js/pull/3856
//   render() {
//     return (
//       <div>    
//         <div>
//           <video ref={ node => this.videoNode = node } className="video-js"></video>
//         </div>
//       </div>
//     )
//   }
// }