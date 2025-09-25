var express = require('express');
 var router = express.Router();


  router.get('/', function(req, res) {
    var count = 25
    res.render("hello-world", {count : count});
  });

  module.exports = router;
