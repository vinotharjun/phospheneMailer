const express = require("express");

const hbs = require("express-handlebars");
const nodemailer=require("nodemailer");
var multer  = require('multer')
const fs=require("fs")
const AWS = require('aws-sdk');

const path=require("path");
const port=process.env.PORT||3000;
const app =express();
const url = require('url');   
app.engine("handlebars",hbs())
app.set('view engine','handlebars');
app.use('/public',express.static(path.join(__dirname,'public')));

const s3 = new AWS.S3({
    accessKeyId: "AKIAJ56OYQ7V6HBUZXNQ",
    secretAccessKey: "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",
    Bucket: "resume-datasets"
});
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


  //file upload
app.post("/send",(req,res)=>{
  upload(req, res, (err) => {
    if (err) throw err
    let array=req.files;
    for(obj in array){
     uploadFile(array[obj]["path"],array[obj]["filename"]);
     var string = encodeURIComponent('File uploaded successfully');
     res.redirect('/?valid=' + string+'&&color=red')
    }
  })
})

const uploadFile=(file,fullname,res)=>{
  fs.readFile(file,(err,data)=>{
      if (err){
          throw err;
      }
      console.log(data);
      const params={
          Bucket:"resume-datasets",
          Key:new Date().getTime().toString()+"-"+fullname,
          Body:data
      }
      s3.upload(params,(err,data)=>{
          if(err) {
            var string = encodeURIComponent('Some error occured');
            res.redirect('/?valid=' + string+'&&color=red')
            throw err;
          }
          console.log("file uploaded");
          
      })
  })

}
  app.listen(port,()=>{
      console.log("leander ")
  })
  //hi this is vinoth
