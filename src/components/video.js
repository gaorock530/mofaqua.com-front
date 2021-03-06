import React, { PureComponent } from 'react';
// import shaka from 'shaka-player';
import Spinner from './animates/spinner';
// import { connect } from 'react-redux';
// import * as actions from '../redux/actions';
import HLS from 'hls.js';
import enableInlineVideo from 'iphone-inline-video';

/**
 * @param {String} mpdUrl media manifest URL
 * @param {Object} options custom options
 */

class Video extends PureComponent {
  constructor (props) {
    super(props);
    this.mpdUrl = this.props.mpdUrl; // DASH manifest URL
    this.hlsUrl = this.props.hlsUrl; // HLS
    this.selectors = {}; // all the selectors within player
    this.isFocused = true; // is player focused
    this.inside = false; // is mouse inside player
    this.timer = null; // player control bar fade-out timer
    this.controlOver = false; // is mouse over control bar
    this.fullScreen = false; // is player in fullscreen mode
    this.menuShow = false; // is player menu showing
    this.controlShow = false; 
    this.initial = true; // first startup - control bar
    this.isMute = false; // is player muted
    this.menuProp = null; // stores menu Height/Width
    this.player = null; // stores Player
    this.status = 0; // 0 - loading, 1 - ready, 2 - broken
    // volume bar
    this.v = {
      move: false,
      x: 0,
      l: 0,
      maxVolPosition: 0
    };
    // player default options
    this.defaultOptions = {
      autoplay: false,
      loop: false,
      volume: 1, // 0 ~ 1
      skip: 3, // seconds
      menu: true
    };
    // get custom options
    this.playerOptions(this.props.options);
  }

  // enable Options
  playerOptions = (options) => {
    if (options && options instanceof Object) {
      for (let option in options) {
        if (typeof this.defaultOptions[option] !== "undefined")
        this.defaultOptions[option] = options[option]
      }
    }
  }

  componentDidMount () {
    // create player DOM and assign selectors
    this.selectors = {
      ...this.selectors,
      wrapper: this.refs.wapper,
      cover: this.refs.cover,
      // video: null,
      control: this.refs.control,
      progress: {
        bar: this.refs.bar,
        bar_base: this.refs.bar_base,
        bar_line: this.refs.bar_line,
        bar_point: this.refs.bar_point
      },
      play: this.refs.play,
      mute: this.refs.mute,
      volume: {
        volWrapper: this.refs.volWrapper,
        volBase: this.refs.volBase,
        volLine: this.refs.volLine,
        volPoint: this.refs.volPoint
      },
      setting: this.refs.setting,
      playlist: this.refs.playlist,
      maxWindow: this.refs.maxWindow,
      fullScreen: this.refs.fullScreen,
      menu: this.refs.menu
    }
    this.onStartPlayer();
    this.initPlayer();
    this.addEventListener();
    enableInlineVideo(this.selectors.video);

  }

  componentWillUnmount () {
    document.removeEventListener('click', this._detectFocus, false);
    document.removeEventListener('keydown', this._keyControl, false);
    document.removeEventListener('fullscreenchange',this._fullScreenChange, false);
    document.removeEventListener('mousemove', this._volumeMouseMove, false);
    document.removeEventListener('mouseup', this._volumeMouseUp, false);
    document.removeEventListener('keyup', this._keyUp, false);
    document.removeEventListener('contextmenu', this._menuControl, false);
  }

  initPlayer = () => {
    window.video = this.selectors.video;
    // instantiate Video.js
    if(HLS.isSupported()) {
      var hls = new HLS();
      
      // prepare and get ready to play
      hls.attachMedia(this.selectors.video);
      hls.on(HLS.Events.MEDIA_ATTACHED, (e) => {
        hls.loadSource(this.hlsUrl);
        hls.on(HLS.Events.MANIFEST_PARSED, (e, data) => {
          console.log(this.selectors.video.networkState)
          if (data.levels[0].height>data.levels[0].width) {
            this.selectors.video.classList.remove('normal');
            this.selectors.video.classList.add('vertical');
          }
          console.log("manifest loaded, found " + data.levels.length + " quality level");
          // this.selectors.video.play();
          this.status = 1;
          this.forceUpdate();
        });
      })

      // hls player error handle
      hls.on(HLS.Events.ERROR, function (event, data) {
        if (data.fatal) {
          switch(data.type) {
          case HLS.ErrorTypes.NETWORK_ERROR:
          // try to recover network error
            console.log("fatal network error encountered, try to recover");
            hls.startLoad();
            break;
          case HLS.ErrorTypes.MEDIA_ERROR:
            console.log("fatal media error encountered, try to recover");
            hls.recoverMediaError();
            break;
          default:
          // cannot recover
            hls.destroy();
            break;
          }
        }
      });
    }
    // hls.js is not supported on platforms that do not have Media Source Extensions (MSE) enabled.
    // When the browser has built-in HLS support (check using `canPlayType`), we can provide an HLS manifest (i.e. .m3u8 URL) directly to the video element throught the `src` property.
    // This is using the built-in support of the plain video element, without using hls.js.
    // Note: it would be more normal to wait on the 'canplay' event below however on Safari (where you are most likely to find built-in HLS support) the video.src URL must be on the user-driven
    // white-list before a 'canplay' event will be emitted; the last video event that can be reliably listened-for when the URL is not on the white-list is 'loadedmetadata'.
    else if (this.selectors.video.canPlayType('application/vnd.apple.mpegurl')) {
      this.selectors.video.src = this.hlsUrl;
      this.selectors.video.addEventListener('loadedmetadata',function() {
        this.selectors.video.play();
      }, {once: true});
    }
  }

  onStartPlayer = () => {
    // set volume from Localstorage or DefaultOptions
    this.changeVol(localStorage.getItem('volume') || this.defaultOptions.volume);
    // set autoplay
    this.selectors.video.autoplay = this.defaultOptions.autoplay;
    // set loops
    this.selectors.video.loop = this.defaultOptions.loop;
    // set control bar show first
    this.showControl();
  }

  addEventListener = () => {
    // detect mouse is inside player as [FOCUSed]
    document.addEventListener('click', this._detectFocus, false);

    // player event
    this.selectors.video.addEventListener('canplay', () => {
      console.log('video canplay');
      console.log(this.selectors.video.duration);
      this.status = 1;
      this.forceUpdate();
    });
    
    this.selectors.video.addEventListener('waiting', (e) => {
      console.log('waiting')
      this.status = 0;
      this.forceUpdate();
    })
    // this.selectors.video.addEventListener('stalled', () => {
    //   console.log('stalled')
    // })
    // this.selectors.video.addEventListener('emptied', () => {
    //   console.log('emptied')
    // })

    // this.selectors.video.addEventListener('timeupdate', () => {
    //   console.log(this.selectors.video.buffered);
    // })

    // this.selectors.video.addEventListener('play', () => {
    //   console.log('video play');
    //   this.setState({loading: false});
    // });

    // this.selectors.video.addEventListener('playing', () => {
    //   console.log('video playing');
      
    //   console.log(this.player.getBufferedInfo());
    // });
    // this.selectors.video.addEventListener('timeupdate', () => {
    //   // console.log(this.player.getBufferedInfo());
    // });

    // play/pause EVENT
    document.addEventListener('keydown', this._keyControl, false);

    this.selectors.cover.addEventListener('click', this._togglePlay, false);
    this.selectors.play.addEventListener('click', this._togglePlay, false);

    this.selectors.video.addEventListener('play', this._state_play_update, false);
    this.selectors.video.addEventListener('pause', this._state_play_update, false);

    // enter Video / display control
    this.selectors.wrapper.addEventListener('mouseenter', this._playerEnter, false);

    this.selectors.wrapper.addEventListener('mouseleave', this._playerLeave, false);

    this.selectors.wrapper.addEventListener('mousemove', this.showControl, false);


    this.selectors.control.addEventListener('mouseenter', this._controlEnter, false);

    this.selectors.control.addEventListener('mouseleave', this._controlLeave, false);
     
    // fullscreen EVENT
    this.selectors.fullScreen.addEventListener('click', this._toggleFullscreen, false);

    this.selectors.cover.addEventListener('dblclick', this._toggleFullscreen, false);

    document.addEventListener('fullscreenchange',this._fullScreenChange, false);

    // mute EVENT
    this.selectors.mute.addEventListener('click', this._toggleMute, false)

    this.selectors.video.addEventListener('volumechange', this._volumeChange, false);

    // volume EVENT
    this.selectors.volume.volWrapper.addEventListener('mousedown', this._volumeMouseDown, false)

    document.addEventListener('mousemove', this._volumeMouseMove, false);

    document.addEventListener('mouseup', this._volumeMouseUp, false);

    document.addEventListener('keyup', this._keyUp, false);
    

    // progress bar

    this.selectors.progress.bar.addEventListener('click', this._progressClick, false);

    this.selectors.progress.bar.addEventListener('mouseenter', this._progressMouseEnter, false);

    this.selectors.progress.bar.addEventListener('mouseleave', this._progressMouseLeave, false);

    this.selectors.video.addEventListener('timeupdate', this._timeUpdate, false);

    // custom menu
    // document.addEventListener('contextmenu', this._menuControl, false);

    // Video maximize
    this.selectors.maxWindow.addEventListener('click', (e) => {
      this.selectors.wrapper.classList.toggle('fullscreen');
    });
  }

  /** 
   * ------------------------------------
   * PLayer Control Event handlers
   * ------------------------------------
  */

  _playerEnter = () => {
    this.showControl();
    this.inside = true;
  }

  _playerLeave = () => {
    if (!this.selectors.video.paused) this.hideControl()     
    this.inside = false;
  }

  _controlEnter = () => {
    if (this.timer) clearTimeout(this.timer);
  }

  _controlLeave = () => {
    if (!this.selectors.video.paused) this.timer = setTimeout(this.hideControl, 3000);
  }

  _fullScreenChange = () => {
    let el = document.fullscreenElement;
    if (el && el.classList.contains('body-main-display-wrapper')) {
      this.refs.wapper.classList.add('video-full');
      this.fullScreen = true;
    } else {
      this.refs.wapper.classList.remove('video-full');
      this.fullScreen = false;  
    }
    this.state_fullscreen_update();
  }

  // Right click Window menu event
  _menuControl = (e) => {
    if (!this.defaultOptions.menu) return;
    if (!this.inside) return this.clearMenu();
    //inside player
    e.preventDefault();
    if (e.target.nodeName === 'SPAN') return;
    let maxY = this.selectors.wrapper.offsetHeight - this.menuProp.height;
    let maxX = this.selectors.wrapper.offsetWidth - this.menuProp.width;
    let extraX = this.selectors.wrapper.parentElement.offsetLeft;
    let extraY = this.selectors.wrapper.offsetTop + this.selectors.wrapper.parentElement.offsetTop - window.scrollY;
    let x = this.fullScreen? e.clientX:e.clientX - extraX;
    let y = this.fullScreen? e.clientY:e.clientY - extraY;
    console.log(this.selectors.wrapper.offsetTop,this.selectors.wrapper.parentElement.offsetTop,window.scrollY,e.clientY);
    if (y >= maxY) y = maxY;
    if (x >= maxX) x = maxX;
    this.selectors.menu.style.top = y + "px";
    this.selectors.menu.style.left = x + "px";
    return this.addMenu();
  }

  addMenu = () => {
    this.selectors.menu.classList.remove('none');
    this.menuShow = true;
  }

  clearMenu = () => {
    this.selectors.menu.classList.add('none');
    this.menuShow = false;
  }

  _detectFocus = () => {
    this.isFocused = this.inside ? true : false; 
    this.clearMenu();
  }

  _keyControl = (e) => {
    if (!this.isFocused) return;
    e.preventDefault();
    let c = e.charCode || e.keyCode;

    switch(c) {
      case 32:
        this._togglePlay();
        this.showControl();
      break;

      case 37:
        this.changeTime(-this.defaultOptions.skip);
      break;

      case 38:// up
        if (this.defaultOptions.volume >= 0.89) this.changeVol(1);
        else this.changeVol(this.defaultOptions.volume + 0.1);
      break;

      case 39:
        this.changeTime(this.defaultOptions.skip);
      break;

      case 40: //down
        if (this.defaultOptions.volume <= 0.11) this.changeVol(0);
        else this.changeVol(this.defaultOptions.volume - 0.1);
      break;
      default:
    }
  }

  _keyUp = (e) => {
    if (this.isFocused && (e.keyCode === 38 || e.keyCode === 40)) {
      localStorage.setItem('volume', this.selectors.video.volume);
    }
  }


  // detect CSS transition finish EVENT
  whichTransitionEvent = (el) => {
    const transitions = {
      'transition':'transitionend',
      'OTransition':'oTransitionEnd',
      'MozTransition':'transitionend',
      'WebkitTransition':'webkitTransitionEnd'
    }
    for(let t in transitions){
        if( el.style[t] !== undefined ){
            return transitions[t];
        }
    }
  }

  // on mouse wheel Event
  _onWheel = (e) => {
    e.preventDefault()
    console.log(e.deltaY);
    return false;
  }

  // Control show/hide
  showControl = () => {
    if (this.controlShow) return;
    if (this.timer) clearTimeout(this.timer);
    this.selectors.control.classList.remove("control-ease-out");
    this.selectors.control.classList.add("control-ease-in");
    this.selectors.wrapper.classList.remove("nocursor");
    this.controlShow = true;
    this.timer = setTimeout(this.hideControl, 3000);
  }

  hideControl = () => {
    if (this.selectors.video.paused) return;
    this.selectors.control.classList.remove("control-ease-in");
    this.selectors.control.classList.add("control-ease-out");
    if (this.fullScreen) this.selectors.wrapper.classList.add("nocursor");
    clearTimeout(this.timer);
    this.controlShow = false;
  }

  // handle Volume
  changeVol = (vol) => {
    console.log(this.selectors.video)
    if (vol > 1 || vol <0) vol = Math.round(vol);
    let pos = this.v.maxVolPosition * vol;
    this.selectors.volume.volPoint.style.left=pos+'px';
    this.selectors.volume.volLine.style.width=Math.max(0,pos+2)+'px';
    this.selectors.video.volume = vol;
  }

  changeTime = (time) => {
    time = this.selectors.video.currentTime + time;
    if (time <= 0) this.selectors.video.currentTime = 0;
    else if (time >= this.selectors.video.duration) return false
    else this.selectors.video.currentTime = time;
  }
  
  _volumeChange = () => {
    if (this.selectors.video.volume === 0) {
      this.isMute = true;
      this.selectors.mute.classList.remove('fa-volume-up');
      this.selectors.mute.classList.add('fa-volume-off');
    }else {
      this.isMute = false;
      this.selectors.mute.classList.remove('fa-volume-off');
      this.selectors.mute.classList.add('fa-volume-up');
    }
    if (!this.isMute) this.defaultOptions.volume = this.selectors.video.volume;
  }

  _volumeMouseDown = (event) => {
    this.v.move = true;
    if (event.target !== this.selectors.volume.volPoint) {
      let X = (event || window.event).offsetX-5;
      let to = Math.min(this.v.maxVolPosition, Math.max(-2,X));
      this.changeVol(Math.max(0,to/this.v.maxVolPosition));
    } 

    this.v.x = (event || window.event).clientX;
    this.v.l = this.selectors.volume.volPoint.offsetLeft;
  }

  _volumeMouseMove = (event) => {
    if (!this.v.move) return;
    let thisX = (event || window.event).clientX;
    let to = Math.min(this.v.maxVolPosition, Math.max(-2,this.v.l+(thisX-this.v.x)));
    this.changeVol(Math.max(0,to/this.v.maxVolPosition));
    window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
  }

  _volumeMouseUp = () => {
    if (this.v.move) {
      localStorage.setItem('volume', this.selectors.video.volume);
      this.v.move = false
    }
  }

  _progressClick = (e) => {
    let time = e.offsetX / this.selectors.progress.bar_base.offsetWidth * this.selectors.video.duration;
    this.selectors.video.currentTime = time;
  }

  _progressMouseEnter = () => {
    this.selectors.progress.bar_base.style.height = 5 + 'px';
    this.selectors.progress.bar_base.style.top = 10 + 'px';
    this.selectors.progress.bar_point.style.height = 5 + 'px';
    this.selectors.progress.bar_point.style.opacity = 1;
  }

  _progressMouseLeave = () => {
    this.selectors.progress.bar_base.style.height = 3 + 'px';
    this.selectors.progress.bar_base.style.top = 12 + 'px';
    this.selectors.progress.bar_point.style.height = 3 + 'px';
    this.selectors.progress.bar_point.style.opacity = 0;
  }

  _timeUpdate = () => {
    let length = Math.ceil(this.selectors.video.currentTime / this.selectors.video.duration * this.selectors.progress.bar_base.offsetWidth);
    this.selectors.progress.bar_line.style.width = length + 1 + "px";
    this.selectors.progress.bar_point.style.left = length - 3 + "px";
  }

  // handle Mute
  _toggleMute = () => {
    if (this.selectors.video.volume !== 0) {
      this.changeVol(0);      
    }else{
      if (this.defaultOptions.volume <= 0.05) this.defaultOptions.volume = 0.8;
      this.changeVol(this.defaultOptions.volume);
    }
    this.selectors.mute.classList.toggle('fa-volume-up');
    this.selectors.mute.classList.toggle('fa-volume-off');
  }


  // handle Play
  _togglePlay = () => {
    if(this.menuShow) return;
    if (this.selectors.video.paused) {
      this.selectors.video.play()
      this.timer = setTimeout(() => {
        this.hideControl()
      }, 3000);
    } else {
      this.selectors.video.pause()
    }
    this.showControl();
  }

  _state_play_update = () => {
    this.selectors.play.classList.toggle('fa-pause');
    this.selectors.play.classList.toggle('fa-play');
  }

  //handle fullscreen
  _toggleFullscreen = () => {
    if (document.fullscreenElement) {
      this.exitFS();
      this.fullScreen = false;
    } else {
      this.enterFS(this.selectors.wrapper);
      this.fullScreen = true;
    }
    this.state_fullscreen_update();
  }

  state_fullscreen_update = () => {
    if (this.fullScreen) {
      this.selectors.fullScreen.classList.remove('fa-expand');
      this.selectors.fullScreen.classList.add('fa-compress');
    } else {
      this.selectors.fullScreen.classList.remove('fa-compress');
      this.selectors.fullScreen.classList.add('fa-expand');
    }
  }

  enterFS = (element) => {
    this.refs.wapper.classList.add('video-full');
    if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen();
    } else if (element.webkitRequestFullScreen) {
      element.webkitRequestFullScreen();
    } else if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.msRequestFullscreen) {
      element.msRequestFullscreen();
    }
  }

  exitFS = () => {
    this.refs.wapper.classList.remove('video-full');
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }

  render () {
    return (
      <div ref="wapper" className="body-main-display-wrapper">
        <div className="vid">
          <video className="normal" ref={node => this.selectors.video = node} playsInline></video>
        </div>

        <div ref="controlWapper" className="video-control-wapper">
          <div ref="control" className="video-control control-ease-in">
            <div id="control-bar-top"></div>
            <div id="control-bar-bottom">
              <div ref="bar" className="control-bar-progress">
                <div ref="bar_base" className="progress_bar_base">
                  <div ref="bar_line" className="progress_bar_line"></div>
                  <div ref="bar_point" className="progress_bar_point"></div>
                </div>
              </div>
              <div className="control-bar-bottom-left">
                <i ref="play" className="fa fa-play"></i>
                <i ref="mute" className="fa fa-volume-up"></i>
                <div ref="volWrapper" className="vol-wrapper">
                  <div ref="volBase" className="vol-base">
                    <div ref="volLine" className="vol-line" style={{"width": "51px"}}></div>
                    <div ref="volPoint" className="vol-point" style={{"left": "49px"}}></div>
                  </div>
                </div> 
              </div>
              <div className="control-bar-bottom-right">
                <i ref="setting" className="fa fa-cog"></i>
                <i ref="playlist" className="fa fa-eercast"></i>
                <i ref="maxWindow" className="fa fa-window-maximize"></i>
                <i ref="fullScreen" className="fa fa-expand"></i>
              </div>
            </div>
          </div>
          {this.status === 0?<Spinner size="50px">加载中</Spinner>:''}
          <div ref="cover" className="video-cover-layer"></div>
          <div ref="menu" className="player-menu">
            <li>Magic PLayer</li>
            <li>version 1.0</li>
            <li>Dash supported</li>
            <li>LIVE supported</li>
          </div>
        </div>
        {/* <div id="setup-bar">
          <div className="setup-bar-item">
            <span>Play rate</span>
            <i className="fa fa-play"></i>
          </div>
          <div className="setup-bar-item">
            <span>Play rate</span>
            <i className="fa fa-play"></i>
          </div>
          <div className="setup-bar-item">
            <span>Play rate</span>
            <i className="fa fa-play"></i>
          </div>
        </div> */}
      </div>
    )
  }
}

// export default connect(state => state, actions)(Video);
export default Video;