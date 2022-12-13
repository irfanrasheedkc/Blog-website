var express = require('express');
var router = express.Router();
const res = require('express/lib/response.js');
const userHelpers = require('../helpers/user-helpers.js');

router.get('/', function(req, res, next) {
  res.render('user/home.hbs');
});

router.get('/signin',function(req , res , next){
  res.render('user/signin.hbs');
});

router.get('/signup' , function(req , res , next){
  res.render('user/signup.hbs');
});

router.post('/signup' , function(req , res){
  console.log(req.body)
  userHelpers.doSignup(req.body).then((response)=>{
    res.send("Signup Success");
  })
})

router.post('/signin' , function(req , res){
  console.log("Reached here too")
  console.log(req.body)
  // userHelpers.doSignup(req.body)
})

module.exports = router;
