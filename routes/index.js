var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'namiekon' });
});
router.get('/matching_male', function(req, res) {
  res.render('matching_male', { title: 'namiekon' });
});
router.get('/matching_female', function(req, res) {
  res.render('matching_female', { title: 'namiekon' });
});

module.exports = router;
