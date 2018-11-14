import api from './api';

const path = process.env.NODE_ENV === 'development'? 'wss://localhost:5000/pulse': 'wss://websocket.mofaqua.com/pulse';

const ws = new api(path, {
  attempt: 10,
  autoreconnect: true, 
  arraybuffer: true, 
  protocol: ['pulse']
});

export default ws

// const API = {
//   /** @function init initial authentication */
//   ws,
//   init: () => {
//     ws.on('open', (e) => {
//       console.log('socket open.');
//     }, true)
//     ws.on('error', (e) => {
//       console.log(e);
//     })
//     ws.on('close', (e, r) => {
//       console.log(e, r);
//     })
//   },
//   send: (value) => {
    
//   }
// }

// export default API;