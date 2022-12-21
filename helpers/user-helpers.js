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
            blog: blogData,
            like: []
        }
        return new Promise(async (resolve, reject) => {
            db.get().collection(collection.BLOGSTORE_COLLECTION).insertOne(data).then(async (res) => {
                let userBlog = await db.get().collection(collection.BLOG_COLLECTION).findOne({ user: objectId(userId) })
                if (userBlog) {
                    db.get().collection(collection.BLOG_COLLECTION).updateOne({ user: objectId(userId) }, { $push: { blog: res.insertedId } }).then((err, res) => {
                        resolve();
                    })
                }
                else {
                    db.get().collection(collection.BLOG_COLLECTION).insertOne({user:objectId(userId) , blog:[res.insertedId]}).then((err, res) => {
                        resolve()
                    })
                }
            })

        })
    },
    getBlogs: () => {
        return new Promise(async (resolve, reject) => {
            db.get().collection(collection.BLOGSTORE_COLLECTION).aggregate([
                // {
                //     $unwind: "$blog"
                // },
                {
                    $lookup: {
                        from: collection.USER_COLLECTION,
                        localField: 'user',
                        foreignField: '_id',
                        as: 'username'
                    }
                },
                {
                    $addFields: {
                        "blog.user": "$username.name"
                    }
                },
                {
                    $group: {
                        _id: null,
                        newblog: { $push: "$blog" }
                    }
                }
            ]).toArray(async (err, documents) => {
                console.log(documents[0].newblog)
                blogDetails = documents[0].newblog
                resolve(blogDetails);
            })
        })
    }
}