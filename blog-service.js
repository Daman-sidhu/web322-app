const fs = require('fs')

let posts = []
let categories = []

module.exports.initialize = () => {

    return new Promise((resolve, reject) => {

        fs.readFile('./data/posts.json', 'utf8', (error, data) => {
            if (error) {
                reject('unable to open file')
            }

            posts.push(...JSON.parse(data))
        })

        fs.readFile('./data/categories.json', 'utf8', (error, data) => {
            if (error) {
                reject('unable to open file')
            }

            categories.push(JSON.parse(data))
        })
        resolve('success')
    })
}


module.exports.getAllPosts = () => {

    return new Promise((resolve, reject) => {
        if (posts.length !== 0) {
            resolve(posts)
        }
        reject('no results returned')
    })
}
module.exports.getPublishedPosts = () => {
    const Published = posts.filter(post => post.published === true)
    return new Promise((resolve, reject) => {

        if (Published.length !== 0) {
            resolve(Published)
        }
        reject('no results returned')
    })
}
module.exports.getCategories = () => {
    return new Promise((resolve, reject) => {
        if (categories.length !== 0) {
            resolve(categories)
        }
        reject('no results returned')
    })
}
module.exports.addpost = (postData) => {
    return new Promise((resolve, reject) => {
        if (postData.published) {
            postData.published = false
        } else {
            postData.published = true
        }

        postData.id = posts.length + 1
        posts.push(postData)
        resolve(postData)
        if (!postData) {
            reject("Error")
        }
    })
}

module.exports.getPostsByCategory = (category) => {
    const newPosts = posts.filter(post => post.category == category)
    return new Promise((resolve,reject)=> {
        
        if(newPosts.length !== 0) {
            resolve(newPosts)
        }
        reject('no result returned!')
    })
}

module.exports.getPostsbyMinDate = (minDateStr) => {
    const newPosts = posts.filter(post=> new Date(post.postDate) >= new Date(minDateStr) )
    return new Promise((resolve,reject)=> {
        
        if(newPosts.length !== 0) {
            resolve(newPosts)
        }
        reject('no result returned!')
    })
} 

module.exports.getPostById = (id) => {
    const newPosts = posts.find(post => post.id == id )
    return new Promise((resolve,reject)=> {
        
        if(newPosts) {
            resolve(newPosts)
        }
        reject('no result returned!')
    })
}