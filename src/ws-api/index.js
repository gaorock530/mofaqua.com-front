import api from './api';

const ws = new api('wss://localhost:5002/pulse', {
  attempt: 10,
  autoreconnect: true, 
  arraybuffer: true, 
  protocol: ['pulse']
});

const API = {
  /** @function init initial authentication */
  ws,
  init: () => {
    ws.on('open', (e) => {
      console.log('socket open.');
    }, true)
    ws.on('error', (e) => {
      console.log(e);
    })
    ws.on('close', (e, r) => {
      console.log(e, r);
    })
  },
  send: (value) => {
    
  }
}

export default API;