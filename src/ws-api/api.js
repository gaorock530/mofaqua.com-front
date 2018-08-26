import Event from './event';
import Debouncer from './debouncer';
// import validator from 'validator';
// import warning from '../components/forms/warning';
import {parse as URL} from 'url';
// import { resolve } from 'path';
// use socket.io browserified version
// const io = require('socket.io-client/dist/socket.io.dev');
// const jwt = require('jsonwebtoken');
// const cuid = require('cuid');
const md5 = require('../helper/md5').hex_md5;


/*--------------------------------------------------------------------
 *              Constants
 --------------------------------------------------------------------*/

// get navigator for unique user finger-print
// 1. userAgent
const UA = navigator.userAgent || window.navigator.userAgent;
// 2. screen size
const SS = (window.screen.width + window.screen.height) || false;
const SD = (window.screen.colorDepth + window.screen.pixelDepth) || false;
// 3. device memory
// const ND = navigator.deviceMemory || window.navigator.deviceMemory || false;
// 4. hardwareConcurrency
const HC = navigator.hardwareConcurrency || window.navigator.hardwareConcurrency || false;

// hash for finger print
const FingerPrint = md5(UA + SS + SD + HC);

const AllowedPath = ['/', '/pulse', 'tunnel', '/test/pulse'];
// const AllowedEvent = ['open', 'message', 'close', 'error', 
//                       'int',      // initial handshake
//                       'rgt',      // registration
//                       'login',    
//                       'logout',
//                       // 'act',      // activity
//                       'chk',      // check [username/email/phone]
//                       'code',     // get verify code
//                       'upd',
//                       'up-pic',
//                       'up-vod',
//                       'ch-get',
//                       'ch-up-cover'
//                     ];

const defaultOptions = {
  autoreconnect: false,
  retryIn: 5000,
  attempt: 5,
  protocol: null,
  arraybuffer: true,
}


/**
 * @api WS
 * @argument {URL} uri
 * @argument {Object} options
 * @description custom made websocket api
 */

export default class WS {
  constructor(uri, options) {
    this.uri = uri || '';                               // stores connection uri
    this.options = MERGE(options, defaultOptions);      // merge custom options
    this.socket = null;                                 // stores WebSocket connection
    this.events = {};                                   // stores initial events for socket
    this.eventContorl = new Event();                    // stores instance events for client
    this.connection = {
      connectionLatency: 0,                             // websocket initial connection in X ms
      messagingLatency: 0,                              // when sending a message, time to response
      timeStamp: 0                                      // timeStamp of sending
    };            
    
    this.debouncer = {}

    WS.init.call(this);                                 // initialize
  }

  /**
   * @private {readyState} get 'WebSocket' ready state
   */
  get readyState () {
    return this.socket ? this.socket.readyState : 0;
  }
  /**
   * @private {connected} is websocket in good connection
   */
  get connected () {
    return this.readyState === WebSocket.OPEN;
  }

  get isAllowReconnect () {
    return this.options.autoreconnect && !this.connected;
  }

  get buffer () {
    return this.socket ? this.socket.bufferedAmount : null;
  }

  /**
   * @private {isPulse} check if protocol 'pulse' is used 
   */
  get isPulse () {
    return Boolean(this.options.protocol && (this.options.protocol === 'pulse' || ~this.options.protocol.indexOf('pulse')));
  }
  
  /**
   * @private {SUPPORT} check if 'WebSocket' is supported
   * @static 
   */
  static get SUPPORT () {
    return 'WebSocket' in window;
  }
  /**
   * @private {init}
   * @static
   */
  static init() {
    const url = URL(this.uri);
    if (!WS.SUPPORT) throw new Error('WebSocket not supported.');
    if (!url.protocol.match(/^w(s|ss)/ig) || !url.slashes) return console.warn('uri: '+this.uri+' not valid.');
    if (!~AllowedPath.indexOf(url.pathname || '/')) return console.warn('wrong request path.');
    // initial debouncer
    if (this.options.autoreconnect)
    this.debouncer.restart = new Debouncer(this.connect.bind(this), this.options.retryIn, false, this.options.attempt);
    if (this.isPulse) {
      this.debouncer.onactive = new Debouncer(this.send.bind(this, {t: 'act', v: 1}), 500);
      // this.debouncer.onbreak = new Debouncer(this.send.bind(this, {t: 'act', v: 0}), 5000);
    }
    this.connect();
  }

  /**
   * @private {attach}
   * @static
   * @description add event to this.events
   * @param {Object} obj 
   * @param {Event} event 
   * @param {Function} fn 
   */
  static attach(obj, event, fn) {
    if (!this.events[event]) this.events[event] = [];
    this.events[event].push(new Event(obj, event, fn));
  }

  /**
   * @private {detach}
   * @static 
   * @description remove all events from this.events
   */
  static detach() {
    for(let key in this.events) {
      this.events[key].forEach(event => event.detach());
    }
    this.events = {};
  }

  /**
   * @event onopen 
   * @description fires when a websocket is openned successfully
   * @argument {Event} e
   */
  static onopen (e) {
    this.connection.connectionLatency = (Date.now() - this.connection.timeStamp) / 2 | 1;
    // console.log('connectionLatency: ' , this.connection.connectionLatency, 'ms');
    if (this.options.autoreconnect) this.debouncer.restart.reset();
    const token = 'localStorage' in window ? localStorage.getItem('token') : null;
    this.send({t: 'int', h: FingerPrint, token});
    // if (token) this.send({t: 'auth', token});
    this.eventContorl.excute('open', e);
  }
  /**
   * @event onopen 
   * @description fires when a websocket is openned successfully
   * @argument {Event} e
   */
  static onmessage (e) {
    let data = e.data;
    this.connection.messagingLatency = (Date.now() - this.connection.timeStamp) / 2 | 0;
    // console.log('messagingLatency: ' , this.connection.messagingLatency, 'ms');
    if (data instanceof ArrayBuffer) data = decode(data);
    try {data = JSON.parse(data)} catch(e) {}
    this.eventContorl.excute(data.t, data);
  }
  /**
   * @event onopen 
   * @description fires when a websocket is openned successfully
   * @argument {Event} e
   */ 
  static onerror (e) {
    this.options.autoreconnect = false;
    this.eventContorl.excute('error', e);
  }
  /**
   * @event onopen 
   * @description fires when a websocket is openned successfully
   * @argument {Event} e
   */
  static onclose (e) {
    this.eventContorl.excute('close', e.code, e.reason || 'normal closing.');
    WS.detach.call(this);
    if (this.isAllowReconnect && e.code < 4000) this.debouncer.restart.start();
  } 
  static onactive () {
    /* notice: when connection closed this event maybe fire one more time */
    this.debouncer.onactive.start();
    // this.debouncer.onbreak.stop();
  }
  static onbreak () {
    /* notice: when connection closed this event maybe fire one more time */
    this.debouncer.onbreak.start();
    this.debouncer.onactive.stop();
  }

  connect () {
    if (this.socket instanceof WebSocket && this.connected) { 
      this.debouncer.restart.reset();
      return console.warn('connection is restored or already established.');
    }
    this.connection.timeStamp = Date.now();
    if (!this.options.protocol) this.socket = new WebSocket(this.uri);
    else this.socket = new WebSocket(this.uri, this.options.protocol);
    
    this.socket.binaryType = 'arraybuffer';
    WS.attach.call(this, this.socket, 'open', WS.onopen.bind(this));
    WS.attach.call(this, this.socket, 'message', WS.onmessage.bind(this));
    WS.attach.call(this, this.socket, 'close', WS.onclose.bind(this));
    WS.attach.call(this, this.socket, 'error', WS.onerror.bind(this));
    if (this.isPulse) {
      // WS.attach.call(this, window, 'blur', WS.onbreak.bind(this));
      WS.attach.call(this, window, 'focus', WS.onactive.bind(this));
    }
  }

  on (event, fn, once = false) {
    return this.eventContorl.add(event, fn, once); 
  }

  off (event, n) {
    // if(!~AllowedEvent.indexOf(event)) return console.warn('invalid event: ', event);
    return this.eventContorl.del(event, n);
  }
  

  send(data) {
    this.connection.timeStamp = Date.now();
    if (!this.connected) return console.warn('connection closed.');
    if (typeof data === 'object' && !(data instanceof ArrayBuffer)) data = JSON.stringify(data);
    this.socket.send(this.options.arraybuffer ? encode(data): data);
  }

  close () {
    this.socket.close(4001, 'closed by component.');
  }

  
}

/*------------------------------------------------------------------------
 *          Privade Functions utilities
 ------------------------------------------------------------------------*/

/**
 * @description merge {target} to {source}
 * @param {Object} target
 * @param {Object} source
 * @returns {Object} merged object
 */
function MERGE(target, source) {
  const obj = {};
  if (typeof target !== 'object') target = {};
  if (typeof source !== 'object') throw Error('arguments must be Object.');
  Object.keys(source).forEach(key => {
    obj[key] = key in target ? target[key] : source[key];
  })
  return obj;
}

function encode (str) {
  const buf = new ArrayBuffer(str.length*2); // 2 bytes for each char
  const bufView = new Uint16Array(buf);
  for (let i=0, strLen=str.length; i<strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}
function decode (buf) {
  return String.fromCharCode.apply(null, new Uint16Array(buf));
}

