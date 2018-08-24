/**
 * @param {File} file file to be processed
 * @param {Boolean} crop (required) whether resize pic
 * @param {Boolean} opt (required)  whether optimize pic
 * @param {Number} width (optional) if resize, the new width
 * @param {Number} height (optional) if resize, the new height, defalut 16:9
 * @returns {promises} blob url
*/

export default (file, crop = true, opt = true, width, height) => {
  if (crop) {
    if (!width) throw Error('height must be given');
    if (!height) height = width / 1.7777777; // 16:9
  }

  // if file is base64 string, no need for converting to buffer
  if (typeof file === 'string') {
    return new Promise ((resolve, reject) => {
      // use Jimp module
      window.Jimp.read(file).then((photo) => {
        console.log(photo.bitmap.height, photo.bitmap.width);
        // processing
        photo
          .cover(crop?width:photo.bitmap.width, crop?height:photo.bitmap.height)// resize
          //.resize(256, 256)            // resize
          .quality(opt?80:100)                 // set JPEG quality
          //.greyscale()                 // set greyscale
          .getBuffer(window.Jimp.MIME_JPEG, (e, a) => { //save change
          // get processed file buffer, a -> Uint8Array
              if(e) reject(e); 
              console.log(a);
              // generate Blob(file) object from buffer
              const blob = new Blob([a], {type: "image/jpeg"});
              // generate ObjectURL from Blob
              const url = window.URL.createObjectURL(blob);
              // return url
              resolve({url, blob});
          }); 
      });
    });
  }
  
  // initial FileReader
  const container = new FileReader();
  // start read file As ArrayBuffer
  container.readAsArrayBuffer(file);
  // covert to Promise based
  // const height = width / ratio;
  return new Promise ((resolve, reject) => {
    // fire when file converted to arrayBuffer
    container.addEventListener('load', (e) => {
      // use Jimp module
      window.Jimp.read(e.target.result).then((photo) => {
        console.log(photo.bitmap.height, photo.bitmap.width);
        // processing
        photo
          .cover(crop?width:photo.bitmap.width, crop?height:photo.bitmap.height)// resize
          //.resize(256, 256)            // resize
          .quality(opt?80:100)                 // set JPEG quality
          //.greyscale()                 // set greyscale
          .getBuffer(window.Jimp.MIME_JPEG, (e, a) => { //save change
          // get processed file buffer, a -> Uint8Array
              if(e) reject(e); 
              // generate Blob(file) object from buffer
              const blob = new Blob([a], {type: "image/jpeg"});
              console.log(blob.size);
              // generate ObjectURL from Blob
              const url = window.URL.createObjectURL(blob);
              // return url
              resolve({url, blob});
          }); 
      });
      
    });
    container.addEventListener('error', (e) => {
      reject(e);
    });
  }); 

} 