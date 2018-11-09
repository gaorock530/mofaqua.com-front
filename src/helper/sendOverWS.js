import API from '../ws-api';

/**
 * @arg {String} type ws send type
 * @arg {Object} data data to send
 * @arg {Number} timeout network detect time, in Second
 * @arg {String} backType response type 
 * @arg {String} err error text to throw when timeout exceeds
 * @returns {Promise} err || data
 */

export default (type, data = null, timeout = 10, backType, err, multi = true) => {
  if (!type || typeof type !== 'string') throw Error('[type] must be a String.');
  backType = type;
  let timer;
  let content = {};
  content.t = type;
  if (data) content = {content, ...data};
  API.ws.send(content);
  return new Promise((resolve, reject) => {
    API.ws.on(backType, (e) => {
      clearTimeout(timer);
      resolve(e);
    }, multi);
    timer = setTimeout(() => {
      reject(err || 'Network fails, plase try again.');
    }, timeout * 1000);
  })
}