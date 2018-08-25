const express = require('express');
const path = require('path');

const app = express();

const PORT = 5001;

app.disable('etag').disable('x-powered-by');

app.use(express.static(path.join(__dirname, 'build')));

// app.use((req, res, next) => {
//   res.setHeader('Server', 'MagicBox');
//   next();
// });

app.listen(PORT, (err) => {
  console.log( err || `React Static Server is running on Port: ${PORT}`);
});

