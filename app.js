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
  console.log(req.query)
  res.render("index",{msg:req.query.valid,color:req.query.color})
})


app.post("/send",(req,res)=>{
  
  
  upload(req, res, (err) => {
    console.log(req.body)
    

    if(err){
   console.log(err)
    } else {
      if(req.files == undefined){
       console.log("no files")
      } else {
        var array =req.files
        var temp=[]
        for (element in array){
          temp.push({
            filename :element.originalname,
            path:element.path
          })
        }
        var transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: 'vinod.aadvik@gmail.com',
            pass: 'vinoth108'
          }
        });
        
        var mailOptions = {
          from: 'vinod.aadvik@gmail.com',
          to:"vinod.aadvik@gmail.com",
          //to: 'linguisticsresearch@phoenicorn.com',
          subject: 'phosphene mails',
          text: "uploaded resume",
        
          attachments:array
        };
        
        transporter.sendMail(mailOptions, function(error, info){
          if (error) {
            console.log(error);
          //  res.render("index",{msg:"contact has been sent"})
          var string = encodeURIComponent('something error occured');
          res.redirect('/?valid=' + string+'&&color=red')
          
          
          } else {
            console.log('Email sent: ' + info.response);
            for(element in req.files){
              console.log(req.files[element].path)
            fs.unlinkSync(req.files[element].path);
            }
            // res.render("contact",{msg:"contact has been sent"})
           var string = encodeURIComponent('mail sent successfully');
           
          res.redirect('/?valid=' + string+'&&color=green')
        
          }


         
        });
        //validation
        //spinners
        //design
      }
    }
});


})

  app.listen(port,()=>{
    console.log(`app is running on port ${port} just check it out`)
})
