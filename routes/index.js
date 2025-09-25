var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  var  students = ['Ajay', 'Vineeth','Sudheesh']

  res.render("hello-world", {students: students});
});

module.exports = router;