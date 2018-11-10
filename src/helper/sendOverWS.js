import API from '../ws-api';

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
  let content = {};
  content.t = type;
  if (data) content = {...content, ...data};
  API.ws.send(content);
  return new Promise((resolve, reject) => {
    API.ws.on(defaultConfig.backType, (e) => {
      clearTimeout(timer);
      if (!e.err) {
        console.log(e);
        resolve(e.v || e);
      } else {
        reject(e.err);
      }
    }, defaultConfig.once);
    timer = setTimeout(() => {
      reject(defaultConfig.errmsg || 'Network fails, plase try again.');
    }, defaultConfig.timeout * 1000);
  })
}