var db = require('../config/connection')
const collection = require('../config/collections')
const { resolve } = require('promise')
var objectId = require('mongodb').ObjectId

module.exports = {
    doSignup: (userData) => {
        data = {
            name: userData.name,
            email: userData.email,
            password: userData.psw
        }
        return new Promise((resolve, reject) => {
            db.get().collection(collection.USER_COLLECTION).insertOne(data).then((err, res) => {
                if (err)
                    console.log(err)
                else
                    console.log(res)
                resolve()
            })
        })
    },
    doSignin: (userData) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.USER_COLLECTION).findOne({
                email: userData.username,
                password: userData.pwd
            }, (err, user) => {
                if (err) {
                    console.log(err)
                    resolve({ status: false })
                }
                if (user) {
                    resolve({ user: user, status: true })
                }
                else
                    resolve({ status: false })
            })
        })
    },
    postBlog: (blogData, userId) => {
        blogData.date = new Date().toLocaleString(undefined, { timeZone: 'Asia/Kolkata' });
        data = {
            user: objectId(userId),
            blog: [blogData]
        }
        return new Promise(async (resolve, reject) => {
            let userBlog = await db.get().collection(collection.BLOG_COLLECTION).findOne({ user: objectId(userId) })
            if (userBlog) {
                db.get().collection(collection.BLOG_COLLECTION).updateOne({ user: objectId(userId) }, { $push: { blog: blogData } }).then((err, res) => {
                    resolve();
                })
            }
            else {
                db.get().collection(collection.BLOG_COLLECTION).insertOne(data).then((err, res) => {
                    resolve()
                })
            }
        })
    },
    getBlogs: () => {
        return new Promise(async (resolve, reject) => {
            db.get().collection(collection.BLOG_COLLECTION).aggregate([
                {
                    $unwind: "$blog"
                },
                {
                    $group: {
                        _id: null,
                        newblog: { $push: "$blog" }
                    }
                }
            ]).toArray(async (err, documents) => {
                blogDetails = documents[0].newblog
                resolve(blogDetails);
            })
        })
    }
}