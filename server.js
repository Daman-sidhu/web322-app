/*********************************************************************************
*  WEB322 – Assignment 02
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part *  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: ___Damanpreet Singh___________________ Student ID: ____145560207__________ Date: _____5-02-2022___________
*
*  Online (Heroku) URL: _______https://dmnsidhu.herokuapp.com/_________________________________________________
*
*  GitHub Repository URL: _______________https://github.com/Daman-sidhu/web322-app_______________________________________
*
********************************************************************************/ 

const express = require ('express')
const { lstat } = require('fs')
const blogService = require('./blog-service')
const path = require ('path')
const app = express()
const multer = require("multer");
const cloudinary = require('cloudinary').v2
const streamifier = require('streamifier')
const upload = multer();


const port = process.env.PORT || 8080
app.use(express.static(path.join(__dirname,'/public')))
cloudinary.config({
    cloud_name: 'dzi6uaysi',
    api_key: '774313852437156',
    api_secret: 'rprxymlfIzRGvduQFUNTY0FQGds',
    secure: true
});


app.get("/", (req,res) => {
    res.redirect("/about");
});

app.get('/about',(req,res)=> {
    res.sendFile(path.join(__dirname,'/views/about.html'))
})

app.get('/blog',(req,res)=>{
    blogService.getPublishedPosts().then((data)=>{
    res.send(data)
    }).catch((error)=> {
    res.send({
        error: error
    })
    
    })
})


app.get('/categories',(req,res)=>{
    blogService.getCategories().then((data)=>{
    res.send(data)
    }).catch((error)=> {
    res.send({
        error: error
    })
    
    })
})

app.get("/posts/add",(req,res)=> {
    res.sendFile(path.join(__dirname,'/views/addPost.html'))
})

app.post("/posts/add",upload.single("featureImage"),(req,res)=> {
    let streamUpload = (req) => {
        return new Promise((resolve, reject) => {
            let stream = cloudinary.uploader.upload_stream(
                (error, result) => {
                if (result) {
                    resolve(result);
                } else {
                    reject(error);
                }
                }
            );
    
            streamifier.createReadStream(req.file.buffer).pipe(stream);
        });
    };
    
    async function upload(req) {
        let result = await streamUpload(req);
        console.log(result);
        return result;
    }
    
    upload(req).then((uploaded)=>{
        req.body.featureImage = uploaded.url;
    
        // TODO: Process the req.body and add it as a new Blog Post before redirecting to /posts
    blogService.addpost(req.body).then((data)=>{
      res.redirect('/posts')
    }).catch((error)=> {
res.send(error)
    })
    });
    
})

app.get("/posts", (req, res) => {
    if (req.query.category) {
      blogService
        .getPostsByCategory(req.query.category)
        .then((data) => {
          res.send(data);
        })
        .catch((error) => {
          return res.send({
            error: error,
          });
        });
    } else if (req.query.minDate) {
      blogService
        .getPostsbyMinDate(req.query.minDate)
        .then((data) => {
          res.send(data);
        })
        .catch((error) => {
          return res.send({
            error: error,
          });
        });
    } else {
      blogService
        .getAllPosts()
        .then((data) => {
          res.send(data);
        })
        .catch((error) => {
          return res.send({
            error: error,
          });
        });
    }
  });

  app.get('/post/:id',(req,res)=> {
      blogService.getPostById(req.params.id).then((data)=> {
          res.send(data)
      })
  })

blogService.initialize().then((data)=>{
    app.listen(port, ()=> {
        console.log(`server is currently listening on (ie: 8080`)
    });
}).catch((error)=> {
    console.log(error)
})
