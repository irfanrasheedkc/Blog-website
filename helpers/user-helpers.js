var db = require('../config/connection')
const collection = require('../config/collections')
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
                email:userData.username,
                password:userData.pwd
            },(err,user)=>{
                if(err){
                    console.log(err)
                    resolve({status:false})
                }
                if(user){
                    resolve({user:user , status:true})
                }
                else
                    resolve({status:false})
            })
        })
    }
}