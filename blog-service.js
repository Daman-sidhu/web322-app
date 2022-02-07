const fs = require('fs')

let  posts = []
let categories = []

module.exports.initialize = () => {

    return new Promise((resolve,reject) => {
    
    fs.readFile('./data/posts.json','utf8',(error,data)=> {
            if(error) {
                reject('unable to open file')
            }
                
                posts.push(...JSON.parse(data))
        })
    
    fs.readFile('./data/categories.json','utf8',(error,data)=> {
            if(error) {
                reject('unable to open file')
            }
               
                categories.push(JSON.parse(data))
    })
    resolve('success')
 })
}


module.exports.getAllPosts = () => {

return new Promise((resolve,reject)=> {
    if(posts.length !== 0) {
        resolve(posts)
    }
    reject('no results returned')
  })
}
module.exports.getPublishedPosts = () => {
    const Published = posts.filter(post => post.published === true)
return new Promise((resolve,reject)=> {
    
    if(Published.length !== 0) {
     resolve(Published)
    }
    reject('no results returned')
  })
}
module.exports.getCategories = () => {
return new Promise((resolve,reject) => {
    if(categories.length !== 0) {
        resolve(categories)
    }
    reject('no results returned')
   })
}
