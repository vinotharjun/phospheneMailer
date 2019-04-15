var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'vinod.aadvik@gmail.com',
    pass: 'vinoth108'
  }
});

var mailOptions = {
  from: 'vinod.aadvik@gmail.com',
  to: 'vinod.looser00@gmail.com',
  subject: 'Sending Email using Node.js',
  text: 'That was easy!',
  attachments:[
      
        {   // file on disk as an attachment
            filename: 'text3.txt',
            path: './app.js' // stream this file
        }   
      
  ]
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});