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
                    db.get().collection(collection.BLOG_COLLECTION).insertOne({ user: objectId(userId), blog: [res.insertedId] }).then((err, res) => {
                        resolve()
                    })
                }
            })

        })
    },
    getBlogs: (userId) => {
        return new Promise(async (resolve, reject) => {
            db.get().collection(collection.BLOGSTORE_COLLECTION).aggregate([
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
                        "blog.user": "$username.name",
                        "blog._id": { $toString: "$_id" }
                    }
                },
                {
                    $addFields: { "blog.like_count": { $size: "$like" } }
                },
                {
                    $addFields: {
                        "blog.like": {
                            $cond: {
                                if: { $in: [objectId(userId), "$like"] },
                                then: 1,
                                else: 0
                            }
                        }
                    }
                },
                {
                    $group: {
                        _id: null,
                        newblog: { $push: "$blog" }
                    }
                },
            ], { multi: true }).toArray((err, documents) => {
                blogDetails = documents[0].newblog
                resolve(blogDetails);
            })
        })
    },
    postLike: (blogId, userId) => {
        console.log(blogId)
        console.log(userId)
        return new Promise(async (resolve, reject) => {
            let likedUser = await db.get().collection(collection.BLOGSTORE_COLLECTION).findOne({
                $and: [
                    { _id: objectId(blogId) },
                    { like: { $in: [objectId(userId)] } }
                ]
            });
            console.log(likedUser)
            if (likedUser) {
                db.get().collection(collection.BLOGSTORE_COLLECTION).updateOne({ _id: objectId(blogId) }, { $pull: { like: objectId(userId) } });
                console.log("Removed")
                resolve(-1);
            }
            else {
                db.get().collection(collection.BLOGSTORE_COLLECTION).updateOne({ _id: objectId(blogId), like: { $ne: objectId(userId) } }, { $push: { like: objectId(userId) } })
                console.log("Liked...")
                resolve(1);
            }
        })
    },
    myBlogs: (userId) => {
        return new Promise(async (resolve, reject) => {
            db.get().collection(collection.BLOGSTORE_COLLECTION).find({ "user": objectId(userId) }).toArray(function (err, docs) {
                resolve(docs)
            })
        })
    },
    deleteBlog: (blogId , userId) => {
        return new Promise(async (resolve, reject) => {
            console.log(userId)
            console.log(blogId)
            await db.get().collection(collection.BLOG_COLLECTION).updateOne({ "user": objectId(userId) }, { $pull: { "blog": objectId(blogId) }});
            await db.get().collection(collection.BLOGSTORE_COLLECTION).deleteOne({ "_id": objectId(blogId) });
            resolve();
        })
    },
    editBlog: (blogId , content) =>{
        return new Promise(async (resolve , reject)=>{
            await db.get().collection(collection.BLOGSTORE_COLLECTION).updateOne({ _id: objectId(blogId) }, { $set: { "blog.content": content } });
            resolve();
        })
    }
}