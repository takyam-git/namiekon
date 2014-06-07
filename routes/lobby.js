var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  console.io('app.io')
  if(!req.session.gender || !req.session.name){
    res.redirect('/');
    res.end();
  }
  res.render('lobby', { user_name: req.session.name, user_gender: req.session.gender });
});

module.exports = router;
