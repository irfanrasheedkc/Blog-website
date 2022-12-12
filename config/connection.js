const state={
    db:null
}

module.exports.connect = function(done){
  const dbname = process.env.dbname;
  const MongoClient = require('mongodb').MongoClient
  const mongo_username = process.env.MONGO_USERNAME
  const mongo_password = process.env.MONGO_PASSWORD


  const uri = `mongodb+srv://${mongo_username}:${mongo_password}@cluster0.ewdoj2g.mongodb.net/blog?retryWrites=true&w=majority`;

    MongoClient.connect(uri , (err , data)=>{
        if(err) 
            return done(err);
        state.db = data.db(dbname);
        done();
    })  
}

module.exports.get = function(){
    return state.db;
}