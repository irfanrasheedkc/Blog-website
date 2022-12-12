var express = require('express');
var router = express.Router();

require('dotenv').config()


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('user/index.hbs', { title: 'Express' });
});

module.exports = router;