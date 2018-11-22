import WS from '../ws-api';
import errorMsg from './errorText';

/**
 * @arg {String} type ws send type
 * @arg {Object} data data to send
 * @arg {Number} timeout network detect time, in Second
 * @arg {String} backType response type 
 * @arg {String} err error text to throw when timeout exceeds
 * @returns {Promise} err || data
 */

export default (type, data = {}, config) => {
  const defaultConfig = {
    timeout: 10,
    backType: type,
    once: true,
    errmsg: null
  }

  if (config && typeof config === 'object'){
    for (let i in defaultConfig) {
      if (i in config) defaultConfig[i] = config[i];
    }
  }

  if (!type || typeof type !== 'string') throw Error('[type] must be a String.');
  let timer;
  const content = {t: type, ...data};
  // console.log(content);
  WS.send(content);
  return new Promise((resolve, reject) => {
    WS.on(defaultConfig.backType, (e) => {
      clearTimeout(timer);
      if (!e.err) {
        // console.log(e);
        resolve(e.v || e);
      } else {
        reject(e.err);
      }
    }, defaultConfig.once);
    if (!defaultConfig.timeout) return;
    timer = setTimeout(() => {
      reject(defaultConfig.errmsg || errorMsg.server400);
    }, defaultConfig.timeout * 1000);
  })
}