

this.onmessage = (e) => {
  const msg = e.data;
  const md5 = require('../helper/md5').hex_md5;
  const reader = new FileReader();
  console.log(msg);
  if (typeof data !== 'object') return {error: 'argument pass to Worker must be {}'};
  switch (msg.type) {
    case 'video':
      reader.readAsText(msg.data);
      reader.addEventListener('load', (e) => {
        const hex = md5(e.target.result);
        this.postMessage({code: 0, res: hex});
      })
      break;
    default:
      this.postMessage('nothing to process');
  }
}
this.onerror = (e) => {
  console.log(e);
}
// self.addEventListener('message', handleMessage);

// self.addEventListener('error', handleError);

/* Handlers - onmessage/onerror */
// function handleMessage (e) {
//   const msg = e.data;
//   const reader = new FileReader();
//   console.log(msg);
//   if (typeof data !== 'object') return {error: 'argument pass to Worker must be {}'};
//   switch (msg.type) {
//     case 'video':
//       reader.readAsText(msg.data);
//       reader.addEventListener('load', (e) => {
//         const hex = md5(e.target.result);
//         self.postMessage({code: 0, res: hex});
//       })
//       break;
//     case 'long':


//       break;
//     default:
//       self.postMessage('nothing to process');
      
//   }
// }

// function handleError (e) {
//   console.log(e);
// }
