var express = require('express');
var router = express.Router();
const res = require('express/lib/response.js');
const userHelpers = require('../helpers/user-helpers.js');

router.get('/', function(req, res, next) {
  let user = req.session.user;
  res.render('user/home.hbs', {user});
});

router.get('/signin',function(req , res , next){
  userLoginErr = req.session.userLoginErr;
  res.render('user/signin.hbs',{userLoginErr});
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
  req.session.userLoginErr=false
  userHelpers.doSignin(req.body).then((response)=>{
    if(response.status)
    {
      req.session.user = response.user
      res.redirect('/')
    }
    else
    {
      req.session.userLoginErr=true
      res.redirect('/signin')
    }
  })
})

router.get('/signout' , function(req , res){
  delete req.session.user;
  res.redirect('/')
})

router.get('/create-blog' , function(req , res){
  res.render('user/create_blog.hbs')
})

router.post('/create_blog' , function(req , res){
  console.log(req.body)
})

module.exports = router;
