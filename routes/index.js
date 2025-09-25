var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {

  res.render("hello-world");

});

//route for handling form submission

router.get('/createUser', function(req, res) {
  const email = req.query.email
  res.render("form-data",{
  email:email, 
  allData:req.query
 });

});
module.exports = router;