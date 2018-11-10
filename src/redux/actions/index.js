// import axios from 'axios';
import animate from '../../helper/animate';
import API from '../../ws-api';

import wsSend from '../../helper/sendOverWS';
import UploadEncoder from '../../helper/uploadEncoder';
import {
  //ws
  LOAD_WEBSOCKET,
  // page state
  TOOGLE_SMALL_WINDOW,
  TOGGLE_SIDEBAR,
  SET_EXPEND_ACTIVE,
  SEARCH_TEXT_CHANGE,
  TOGGLE_TOP,
  SET_SIDEBAR,
  SET_REGISTER_FORM,
  SET_LOGIN_METHOD,
  SET_SETUP_PAGE,
  SET_CHANGE_SETUP,
  SET_TEMP,
  SET_PAGELOAD,
  SET_CITY,
  SET_AREA,
  TOGGLE_CHANNEL_SEARCH,
  SET_CHANNEL_TAB,
  TOGGLE_MINI_NAV,
  ADD_UPLOAD_FILE,
  FILE_UPLOADING,
  FILE_UPLOADED,
  FILE_DESTROY,
  SET_REDIRECT_PATH,
  SET_LAZYLOAD_DATA,
  SET_LAZYLOAD_STATE,
  UPDATE_LAZYLOAD_DATA,
  SET_EDIT_PAGE,
  SET_NOTE,
  SET_ERROR,
  // authentication
  USER_LOGIN,
  USER_LOGOUT,
  USER_LOGGING_START,
  USER_LOGGING_END,
  QR_ACTIVITY,
  PHONE_VERIFY,
  PHONE_RESEND_IN,
  EMAIL_VERIFY,
  EMAIL_RESEND_IN,
  SET_USER,
  SET_CHANNEL,
  SET_LOADING_STATE,
  SET_SUBMITTING_STATE,
  SET_LANGUAGE,
  UPDATE_ADDRESS,
  // notification
  NOTIFICATION_IN,
  NOTIFICATION_OUT,
  // form
  FORM_UPDATE_REPEAT,
  FORM_UPDATE_FREQ,
  FORM_UPDATE_DAY,
  FORM_UPDATE_WEEK,
  FORM_UPDATE_ARRAY,
  FORM_UPDATE_ROUND
} from './types';
// import { rejects } from 'assert';

// const uuid = require('uuid/v1');
const cuid = require('cuid');
API.init();
window.api = API;

/*
    Page state
*/

export const toggle_sidebar = (state) => dispatch => {
  const el2 = document.querySelector('.app-cover');
  if (state) {
    const el1 = document.querySelector('.app-sidebar');
    el1.classList.remove('sidebar-open');
    el1.classList.add('sidebar-close');
    const handler1 = function () {
      dispatch({ type: TOGGLE_SIDEBAR });
    }
    const handler2 = function () {
      el2.classList.add('hide');
    }
    el1.addEventListener(animate(el1, 'animate'), handler1, {once: true});  
    el2.classList.remove('cover-open');
    el2.addEventListener(animate(el2, 'transitions'), handler2, {once: true});
  } else {
    el2.classList.remove('hide');
    el2.classList.add('cover-open');
    dispatch({ type: TOGGLE_SIDEBAR });
  }
  document.querySelector('body').classList.toggle('frozen');
}

export const toggle_small_window = () => dispatch => {
  dispatch({ type: TOOGLE_SMALL_WINDOW });
}

export const set_expend_active = (value = false) => dispatch => {
  dispatch({ type: SET_EXPEND_ACTIVE, value});
}

export const set_search_text = (value = '') => dispatch => {
  dispatch({ type: SEARCH_TEXT_CHANGE, value});
}

export const toggle_top = (value) => dispatch => {
  dispatch({ type: TOGGLE_TOP, value });
}

export const set_sidebar = (element) => dispatch => {
  dispatch({ type: SET_SIDEBAR, element });
}

export const set_register = (value = true) => dispatch => {
  dispatch({ type: SET_REGISTER_FORM, value });
}

export const set_login_method = (value) => dispatch => {
  dispatch({ type: SET_LOGIN_METHOD, value });
}
//

export const current_setup_page = (value) => dispatch => {
  dispatch({ type: SET_SETUP_PAGE, value });
}
export const change_setup_option = (value = null) => dispatch => {
  dispatch({ type: SET_CHANGE_SETUP, value });
}
export const set_error = (error) => dispatch => {
  dispatch({ type: SET_ERROR, error });
}
export const set_temp = (value = null) => dispatch => {
  dispatch({ type: SET_TEMP, value });
}
export const set_pageLoading = (value = false) => dispatch => {
  dispatch({ type: SET_PAGELOAD, value });
}

/* for testing */
// export const set_location_array = (type, value) => async dispatch => {
//   // const value = await axios.get(`http://apis.map.qq.com/ws/district/v1/getchildren?key=BBYBZ-2A66F-UDJJ2-NSWRG-VD3TZ-VSFE2`);
//   // console.log(value);
//   if (type === 'city') {
//     dispatch({ type: SET_CITY, value });
//   } else if (type === 'area') {
//     dispatch({ type: SET_AREA, value });
//   }
// }

export const toggle_channel_search = () => dispatch => {
  dispatch({ type: TOGGLE_CHANNEL_SEARCH });
}
export const set_channel_tab = (value = 'home') => dispatch => {
  dispatch({ type: SET_CHANNEL_TAB, value });
}
export const toggle_mini_nav = () => dispatch => {
  dispatch({ type: TOGGLE_MINI_NAV });
}
export const uploading_pic = (id, file, type) => async dispatch => {
  if (!API.ws.connected) return console.warn('no connection');
  dispatch({ type: ADD_UPLOAD_FILE, id, url: file.url });
  let res = await UploadEncoder(file.blob, 'readAsDataURL');
  let tiemr;
  const limit = 1024*1024;
  return new Promise((resolve, reject)=> {
    // data:*/*;base64,
    // const mime = res.match(/(?<=data:image\/)\w+/)[0];
    const name = cuid();
    res = res.replace(/data:\w+\/\w+;base64,/ig, '');
    const size = res.length;
    const chunk = 1024* 128;
    let index = 0;
    let bitcounter = 0;
    console.log('pic size: ', size);
    // console.log('mime type: ',mime);

    const sendChunk = () => {
      console.log('[before]buffer size: ', API.ws.buffer);
      if(API.ws.buffer <= limit) {
        const bit = res.slice(bitcounter, bitcounter + chunk);
        if (bitcounter < size) {
          console.log('sending segment:', index);
          API.ws.send({t: 'up-pic', v: bit, i: index++, n: name, c: type});
        }else {
          console.log('sending finished.');
          API.ws.send({t: 'up-pic', i: -1, n: name, c: type});
        }
      } else {
        console.log('buffer is full.');
        return setTimeout(sendChunk, 200);
      }
      
      console.log('[after]buffer size: ', API.ws.buffer);

      API.ws.on('up-pic', (e) => {
        clearTimeout(tiemr);
        if (!e.err && !e.l) {
          dispatch({ type: FILE_UPLOADING, id, percent: Math.floor((bitcounter/size)*100)});
          sendChunk();
        }else if (e.err) {
          dispatch({ type: FILE_UPLOADED, id });
          dispatch({ type: FILE_DESTROY, id});
          reject(false)
        }else{
          dispatch({ type: FILE_UPLOADED, id });
          dispatch({ type: FILE_UPLOADING, id, percent: 100});
          if (type === 'tn') {
            dispatch({ type: SET_USER, user: {pic: e.l} });
          } else if (type === 'ch-cover') {
            dispatch({ type: SET_CHANNEL, channel: {cover: e.l} });
          }
          resolve(true);
        } 
      }, true);
      tiemr = setTimeout(() => {
        dispatch({ type: FILE_UPLOADED, id });
        reject(false)
      }, 10000);
      
      bitcounter+=chunk;
    }
    sendChunk();
  })
}
export const destroy_file = (id) => dispatch => {
  dispatch({ type: FILE_DESTROY, id});
}
export const redirect = (path = null) => dispatch => {
  dispatch({ type: SET_REDIRECT_PATH, path });
}

/* Lazy Loading */
/**
 * @param {Number} start the index of array to start
 * @param {Number} step how many data to retrieve
 * @param {Array} data array to get data from
 */
export const set_lazyload = (tab, start, step, data) => dispatch => {
  if (!tab) return dispatch({ type: SET_LAZYLOAD_DATA });
  let value = [];
  let end = start + step;
  let close = false;
  if (end >= data.length) {
    end = data.length;
    close = true;
  };
  return new Promise((resolve, reject) => {
    if (typeof start !== 'number' || typeof step !== 'number' )
    reject('1st and 2nd arguments must be Number');
    if (!data instanceof Array) reject('3rd argument must Array');
    for (let i=start;i<end;i++) {
      value.push(data[i]);
    }
    dispatch({ type: SET_LAZYLOAD_STATE, tab, state: true });
    setTimeout(() => {
      if (close) dispatch({ type: SET_LAZYLOAD_STATE, tab, state: null });
      else dispatch({ type: SET_LAZYLOAD_STATE, tab, state: false });
      dispatch({ type: SET_LAZYLOAD_DATA, tab, data: value })
      resolve(value);
    },2000); 
  })
}

export const update_lazyload = (tab, id, update) => dispatch => {
  if (!tab || !id || !update) throw Error('please provide Tab, ID and update Object');
  dispatch({ type: UPDATE_LAZYLOAD_DATA, tab, id, update});
}

//
export const set_edit_page = (edit) => dispatch => {
  dispatch({ type: SET_EDIT_PAGE, edit });
}
export const set_note = (note) => dispatch => {
  dispatch({ type: SET_NOTE, note});
}

/*
    User state
*/

/* Verify */
export const user_verify = () => dispatch => {
  // let connection = setTimeout(() => {
  //   dispatch({ type: NOTIFICATION_IN, id: cuid(), text: '离线网络，请在接入网络后刷新'});
  // }, 1000);
  API.ws.on('int', (e) => {
    // clearTimeout(connection);
    if (e.v === 1) {
      dispatch({type: SET_USER, user: e.u});
      dispatch({type: USER_LOGIN});
    } else if (e.v === 0) {
      dispatch({ type: USER_LOGOUT });
    } else {
      console.warn('server response error.');
    }
    dispatch({ type: LOAD_WEBSOCKET, ws: true});
  }, true);
  API.ws.on('logout', (e) => {
    if (!e.err) {
      dispatch({ type: USER_LOGOUT });
      dispatch({ type: SET_USER, user: null });
    }
  });
  API.ws.on('login', (e) => {
    if (!e.err) {
      dispatch({ type: SET_USER, user: e.u })
      dispatch({ type: USER_LOGIN });
    }
  });
  API.ws.on('rgt', (e) => {
    if (!e.err) {
      dispatch({ type: SET_USER, user: e.u })
      dispatch({ type: USER_LOGIN });
    }
  });
  API.ws.on('upd', (e) => {
    console.log('upd:', e);
    if (!e.err) {
      if (e.c === 'ch-cover') {
        dispatch({ type: SET_CHANNEL, channel: e.u })
      }else{
        dispatch({ type: SET_USER, user: e.u })
      }
    }
  });
}


export const user_login = (username, password) => async dispatch => {
  dispatch({ type: USER_LOGGING_START });
  try {
    const data = await wsSend('login', {user: username, pass: password});
    localStorage.setItem('token', data.token);
    dispatch({ type: SET_USER, user: data.u });
    dispatch({ type: USER_LOGIN });
  }catch(e) {
    console.log(e);
  }
  dispatch({ type: USER_LOGGING_END});
}


export const register = (user) => async dispatch => {
  if (user.name.type !== 'phone' && user.name.type !== 'email') return;
  dispatch({ type: USER_LOGGING_START });
  try {
    const data = await wsSend('rgt', {v: user.name.value, s: user.pass, c: user.code, n: user.nick});
    console.log(data);
    window.localStorage.setItem('token', data.token);
    dispatch({type: SET_USER, user: data.u});
    dispatch({ type: USER_LOGIN });
  }catch(e) {
    console.log(e);
  }
  dispatch({ type: USER_LOGGING_END});
}

export const user_logout = () => async dispatch => {
  dispatch({ type: USER_LOGGING_START });
  const token = window.localStorage.getItem('token');
  if (!token) {
    dispatch({ type: USER_LOGOUT });
    dispatch({ type: USER_LOGGING_END});
    return;
  } 
  try {
    await wsSend('logout', {token});
    localStorage.removeItem('token');
    dispatch({type: SET_USER, user: null});
    dispatch({ type: USER_LOGOUT });
  }catch(e) {
    console.log(e);
  }
  dispatch({ type: USER_LOGGING_END});
}

export const qrcode = (value) => dispatch => {
  dispatch({ type: QR_ACTIVITY, value })
}

// check phone is taken
export const phone_verify = (value) => async dispatch => {
  if (!value) return dispatch({ type: PHONE_VERIFY, value });
  try {
    await wsSend('chk-p', {v: value}, {backType: 'chk'});
    dispatch({ type: PHONE_VERIFY, value: true });
    return undefined;
  }catch(e) {
    dispatch({ type: PHONE_VERIFY, value: false });
    return e;
  }
}

export const phone_resendin = (value) => dispatch => {
  dispatch({ type: PHONE_RESEND_IN, value });
}

// check email is taken
export const email_verify = (value) => async dispatch => {
  if (!value) return dispatch({ type: EMAIL_VERIFY, value });
  try {
    await wsSend('chk-e', {v: value}, {backType: 'chk'});
    dispatch({ type: EMAIL_VERIFY, value: true });
    return undefined;
  }catch(e) {
    dispatch({ type: EMAIL_VERIFY, value: false });
    return e;
  }
}
export const email_resendin = (value) => dispatch => {
  dispatch({ type: EMAIL_RESEND_IN, value });
}

export const name_verify = (value) => async dispatch => {
  try {
    await wsSend('chk-n', {v: value}, {backType: 'chk'});
    return undefined;
  }catch(e) {
    return e;
  }
}
// 
export const send_email_code = (email) => async dispatch => {
  try {
    await wsSend('get-code', {e: email}, {backType: 'code'});
    return '验证码已发送，请进入邮箱查收';
  }catch(e) {
    return e;
  }
}

export const send_text_code = (phone) => async dispatch => {
  try {
    await wsSend('get-code', {p: phone}, {backType: 'code'});
    return '验证码已发送，请留意手机短信';
  }catch(e) {
    return e;
  }
}

export const abort_verify = (type) => dispatch => {
  if (type === 'phone') {
    dispatch({ type: PHONE_VERIFY, value: false });
    dispatch({ type: PHONE_RESEND_IN, value: 0 });
  }else if (type === 'email') {
    dispatch({ type: EMAIL_VERIFY, value: false });
    dispatch({ type: EMAIL_RESEND_IN, value: 0 });
  } else {
    dispatch({ type: PHONE_VERIFY, value: false });
    dispatch({ type: PHONE_RESEND_IN, value: 0 });
    dispatch({ type: EMAIL_VERIFY, value: false });
    dispatch({ type: EMAIL_RESEND_IN, value: 0 });
  }
}

export const set_username = (username, uid) => async dispatch => {
  try {
    const res = await wsSend('upd', {uid, o: {username}});
    dispatch({ type: SET_USER, user: res.u });
  }catch(e) {
    throw e;
  }
}

export const get_channel = (uid) => async dispatch => {
  dispatch({ type: SET_LOADING_STATE, value: true});
  try {
    const res = await wsSend('ch-get', {id: uid});
    dispatch({ type: SET_CHANNEL, channel: res});
    dispatch({ type: SET_LOADING_STATE, value: false});
  }catch(e) {
    dispatch({ type: SET_LOADING_STATE, value: false});
    throw e;
  }
}

export const get_user_info = (uid) => async dispatch => {
  dispatch({ type: SET_LOADING_STATE, value: true});
  try {
    const res = await wsSend('u-get', {id: uid});
    dispatch({ type: SET_USER, user: res});
    dispatch({ type: SET_LOADING_STATE, value: false});
  }catch(e) {
    dispatch({ type: SET_LOADING_STATE, value: false});
    throw e;
  }
  
}

export const send_identity = (obj) => async dispatch => {
  dispatch({ type: SET_SUBMITTING_STATE, value: true});
  try {
    await wsSend('put-id', {v: obj});
    dispatch({ type: PHONE_RESEND_IN, value: 0 });
    dispatch({ type: SET_USER, user: {verification: {verified: 1}}});
    dispatch({ type: SET_SUBMITTING_STATE, value: false});
  }catch(e) {
    dispatch({ type: SET_SUBMITTING_STATE, value: false});
    throw e;
  }
}

// used to updata user addresses in 'address' page
export const update_address = (addr) => dispatch => {
  dispatch({ type: UPDATE_ADDRESS, addr: addr });
}


//
export const set_language = (language = "zh") => dispatch => {
  dispatch({ type: SET_LANGUAGE, language});
}



/*
    Notification
*/

export const notification_in = (id, text, pic = null) => dispatch => {
  dispatch({ type: NOTIFICATION_IN, id, text, pic });
  setTimeout(() => {
    dispatch({ type: NOTIFICATION_OUT, id });
  }, 5000);
}
export const notification_out = (id) => dispatch => {
  dispatch({ type: NOTIFICATION_OUT, id });
}

/* 
    Form
*/

export const change_form_data = (prop, value) => dispatch => {
  if (typeof prop === 'undefined' || typeof value === 'undefined') throw Error('missing argument');
  if (prop === 'repeat') {
    dispatch({ type: FORM_UPDATE_REPEAT, value });
  } else if (prop === 'freq') {
    dispatch({ type: FORM_UPDATE_FREQ, value });
  } else if (prop === 'week') {
    dispatch({ type: FORM_UPDATE_WEEK, value });
  } else if (prop === 'day') {
    dispatch({ type: FORM_UPDATE_DAY, value });
  } else if (prop === 'array') {
    dispatch({ type: FORM_UPDATE_ARRAY, value });
  } else if (prop === 'round') {
    dispatch({ type: FORM_UPDATE_ROUND, value });
  }
}

