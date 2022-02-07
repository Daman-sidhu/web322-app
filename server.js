const express = require ('express')
const { lstat } = require('fs')
const blogService = require('./blog-service')
const path = require ('path')
const app = express()

const port = process.env.PORT || 8080
app.use(express.static(path.join(__dirname,'/public')))

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

app.get('/posts',(req,res)=>{
    blogService.getAllPosts().then((data)=>{
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



blogService.initialize().then((data)=>{



    app.listen(port, ()=> {
        console.log(`server is currently listening on (ie: 8080`)
    });
}).catch((error)=> {
    console.log(error)
})


