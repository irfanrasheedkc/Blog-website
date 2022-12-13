var db = require('../config/connection')
const collection = require('../config/collections')
module.exports = {
    doSignup:(userData)=>{
        data = {
            name:userData.name,
            email:userData.email,
            password:userData.psw
        }
        return new Promise((resolve , reject)=>{
            db.get().collection(collection.USER_COLLECTION).insertOne(data).then((err , res)=>{
                if(err)
                    console.log(err)
                else    
                    console.log(res)
                resolve()
            })
        })
    }
}