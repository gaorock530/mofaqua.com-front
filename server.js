const express = require('express');
const path = require('path');
const openBrowser = require('react-dev-utils/openBrowser');

// const QcloudSms = require("qcloudsms_js");
const Mail = require('nodemailer');
// Generate test SMTP service account from ethereal.email
// Only needed if you don't have a real mail account for testing
Mail.createTestAccount((err, account) => {
  console.log('1');
  // create reusable transporter object using the default SMTP transport
  let transporter = Mail.createTransport({
      host: 'smtp.office365.com',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
          user: 'gaorock530@hotmail.com', // generated ethereal user
          pass: 'highonde85211' // generated ethereal password
      }
  });

  // setup email data with unicode symbols
  let mailOptions = {
      from: '"Magic 👻" <gaorock530@hotmail.com>', // sender address
      to: 'gaorock530@gmail.com, gaorock530@hotmail.com', // list of receivers
      subject: 'Hello ✔', // Subject line
      text: 'Hello world?', // plain text body
      html: '<b>Hello world?</b>' // html body
  };
  console.log('2');
  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
      console.log('3');
      if (error) {
          return console.log(error);
      }
      console.log('Message sent: %s', info.messageId);
  });
});



const app = express();

app.disable('etag').disable('x-powered-by');

app.use(express.static(path.join(__dirname, 'build')));

// app.use((req, res, next) => {
//   res.setHeader('Server', 'MagicBox');
//   next();
// });

app.listen(5001, (err) => {
  console.log( err || `React Static Server is running on Port: 5001`);
  if (!err) {
    // openBrowser('http://localhost:5001');
  }
});

