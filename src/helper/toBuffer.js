export default (file) => {
  const container = new FileReader();
  container.readAsArrayBuffer(file);
  return new Promise ((resolve, reject) => {
    container.addEventListener('load', (e) => {
      resolve(e.target.result);
    }, {once: true});
    container.addEventListener('error', (e) => {
      reject(e);
    }, {once: true});
  }); 
}