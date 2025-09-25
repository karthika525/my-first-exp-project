var express = require('express');
var router = express.Router();
router.get('/', function(req, res) {

  res.render("hello-world");

});
//route for handling form submission

router.post('/createUser', function(req, res) {
  const email = req.body.email
  res.render("form-data",{
  email:email, 
  allData:req.body
 });

});

module.exports = router;