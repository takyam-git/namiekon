var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  console.log('sessionID: ', req.sessionID);
  var n = req.session.views || 0;
  req.session.views = ++n;
  res.render('index', { title: 'Namiekon', cnt: n });
});

router.post('/', function(req, res) {

});

module.exports = router;
