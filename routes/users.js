var express = require('express');
const { redirect } = require('express/lib/response.js');
var router = express.Router();
const res = require('express/lib/response.js');
const userHelpers = require('../helpers/user-helpers.js');

const verifyLogin = (req, res, next) => {
  if (req.session.userLoggedIn) {
    next()
  } else {
    res.redirect('/signin')
  }
}

router.get('/', async function (req, res, next) {
  blogs = []
  if (req.session.userLoggedIn) {
    blogs = await userHelpers.getBlogs(req.session.user._id)
  }
  let user = req.session.user;
  console.log(blogs)
  res.render('user/home.hbs', { user, blogs });
});

router.get('/signin', function (req, res, next) {
  userLoginErr = req.session.userLoginErr;
  res.render('user/signin.hbs', { userLoginErr });
});

router.get('/signup', function (req, res, next) {
  res.render('user/signup.hbs');
});

router.post('/signup', function (req, res) {
  userHelpers.doSignup(req.body).then((response) => {
    res.send("Signup Success");
  })
})

router.post('/signin', function (req, res) {
  req.session.userLoginErr = false
  userHelpers.doSignin(req.body).then((response) => {
    if (response.status) {
      req.session.user = response.user
      req.session.userLoggedIn = true
      res.redirect('/')
    }
    else {
      req.session.userLoginErr = true
      res.redirect('/signin')
    }
  })
})

router.get('/signout', function (req, res) {
  delete req.session.user;
  req.session.userLoggedIn = false
  res.redirect('/')
})

router.get('/create-blog', verifyLogin, function (req, res) {
  let user = req.session.user;
  res.render('user/create_blog.hbs', { user })
})

router.post('/create_blog', verifyLogin, function async(req, res) {
  console.log(req.body)
  userHelpers.postBlog(req.body, req.session.user._id).then(() => {
    res.redirect('/');
  })
})

router.post('/add-to-like', verifyLogin, function async(req, res) {
  userHelpers.postLike(req.query.id, req.session.user._id).then((x) => {
    response = {
      status: "Success",
      count: x
    }
    res.send(response);
  })

})

router.get('/my-blogs', verifyLogin, async (req, res) => {
  let blogs = await userHelpers.myBlogs(req.session.user._id);
  let user = req.session.user;
  console.log(blogs)
  res.render('user/myblogs.hbs', { user, blogs });
});

router.get('/edit-blog', verifyLogin, (req, res) => {
  console.log("Edit");
  
});

router.get('/delete-blog', verifyLogin, (req, res) => {
  console.log("Delete");
  userHelpers.deleteBlog(req.query.id, req.session.user._id).then((response) => {
    res.redirect('/my-blogs');
  })
});

router.post('/edit-content', (req, res) => {
  console.log(req.query.content)
  userHelpers.editBlog(req.query.id , req.query.content)
});


module.exports = router;
