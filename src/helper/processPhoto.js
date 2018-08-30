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
    if (!width) throw Error('width must be given');
    if (!height) height = width / 1.7777777; // 16:9
  }

  // if file is base64 string, no need for converting to buffer
  if (typeof file === 'string') {
    return new Promise ((resolve, reject) => {
      // use Jimp module
      window.Jimp.read(file).then((photo) => {
        console.log(photo._originalMime)
        console.log(photo.bitmap.height, photo.bitmap.width);
        // processing
        width = width > photo.bitmap.width? photo.bitmap.width: width;
        height = height > photo.bitmap.height? photo.bitmap.height: height;
        // step.1 - resize
        crop && photo.cover(width, height);
        // step.2 - optical
        opt && photo.quality(80);
        // step.3 - output
        photo.getBuffer(window.Jimp.MIME_JPEG, (e, a) => { //save change
          // get processed file buffer, a -> Uint8Array
          if(e) reject(e); 
          // generate Blob(file) object from buffer
          const blob = new Blob([a], {type: window.Jimp.MIME_JPEG});
          console.log(blob.size);
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
  return new Promise ((resolve, reject) => {
    // fire when file converted to arrayBuffer
    container.addEventListener('load', (e) => {
      // use Jimp module
      window.Jimp.read(e.target.result).then((photo) => {
        console.log(photo.bitmap.height, photo.bitmap.width);
        console.log(photo._originalMime)
        width = width > photo.bitmap.width? photo.bitmap.width: width;
        height = height > photo.bitmap.height? photo.bitmap.height: height;
        // step.1 - resize
        crop && photo.cover(width, height);
        // step.2 - optical
        opt && photo.quality(80);
        // step.3 - output
        photo.getBuffer(window.Jimp.MIME_JPEG, (e, a) => { //save change
          // get processed file buffer, a -> Uint8Array
          if(e) reject(e); 
          // generate Blob(file) object from buffer
          const blob = new Blob([a], {type: window.Jimp.MIME_JPEG});
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