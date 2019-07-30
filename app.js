const express = require("express");
const hbs = require("express-handlebars");
const nodemailer=require("nodemailer");
var multer  = require('multer')
const fs=require("fs")


const path=require("path");
const port=process.env.PORT||3000;
const app =express();
const url = require('url');   

app.engine("handlebars",hbs())
app.set('view engine','handlebars');
app.use('/public',express.static(path.join(__dirname,'public')));


const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function(req, file, cb){
      console.log(req.body)
      cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
  });
  const upload = multer({
    storage: storage
  }).array('avatar',1000);
  
  app.get("/",(req,res)=>{
    res.render("index",{msg:req.query.valid,color:req.query.color})
  })

app.post("/send",(req,res)=>{
 upload(req,res,(err)=>{
  if(err){
  throw err
     } 
  else {
       if(req.files == undefined){
        console.log("no files")
       } 
       else {
         var array =req.files
         var temp=[]
       
         for (element in array){
           console.log(array[element]) 

           temp.push({
             filename :array[element]["originalname"],
             path:array[element]["path"]
           })
         }
        }
        console.log(process.env.MAIL_ID,process.env.PASSWORD)
        console.log(temp)
    
    var transporter = nodemailer.createTransport({
      host: "smtp-mail.outlook.com", // hostname
      secureConnection: false, // TLS requires secureConnection to be false
      port: 587, // port for secure SMTP
    
      auth: {
        user: process.env.MAIL_ID,
        pass: process.env.PASSWORD
      },
      tls: {
        ciphers:'SSLv3'
    }
    });
    var mailOptions = {
      from: 'jbapraveen@hotmail.com',
      to: 'linguisticsresearch@phoenicorn.com',
      subject: 'Research',
      text: 'hey! ',
      attachments:temp
    };
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
        res.send("somthing went wrong")
      } else {
        console.log('Email sent: ' + info.response);
        res.send("mail recieved thank you for your support")
      }
    });
  }
 })

})

  app.listen(port,()=>{
      console.log("leander ")
  })

