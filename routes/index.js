var express = require('express');
var router = express.Router();

require('dotenv').config()


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('user/index.hbs', { title: 'Express' });
});

router.get('/signin',function(req , res , next){

});
module.exports = router;