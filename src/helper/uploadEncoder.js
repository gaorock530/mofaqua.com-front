let fileArrayBuffer = null;

async function UploadEncoder (file, type) {
  const reader = new FileReader();
  return new Promise((resolve, reject) => {
    reader.addEventListener('load', (e) => {
      fileArrayBuffer = e.target.result;
      resolve(fileArrayBuffer);
    }, {once: true});
    reader.addEventListener('error', (e) => {
      reject(e);
    }, {once: true});
    reader[type](file);
  });
  
}

export default UploadEncoder;


