const express = require('express');
const path = require('path');

const app = express();

const PORT = 5001;

app.disable('etag').disable('x-powered-by');

let file = 0;


app.use((req, res, next) => {
  console.log(file++);
  // console.log(req.headers);
  res.setHeader('Server', 'MagicBox');
  next();
});

app.use(express.static(path.join(__dirname, 'build'), {
  index: false,
  maxAge: '1d',
}));

// app.get('/',(req, res) => {
//   console.log('/')
//   res.status(200).sendFile(path.join(__dirname+'/build/index.html'));
// });

app.all('*', (req, res) => {
  console.log('/')
  res.status(200).sendFile(path.join(__dirname+'/build/index.html'));
});


app.listen(PORT, (err) => {
  console.log( err || `React Static Server is running on Port: ${PORT}`);
});

