var express = require('express');
var router = express.Router();


const { validationResult ,check } = require('express-validator');

router.get('/', function(req, res) {
  res.render("hello-world", { errors: [] });
});

router.post('/createUser', [
  
  check('email').isEmail().withMessage('Invalid email address'),
  check('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
], function(req, res) {
 
  const errors = validationResult(req);


  if (!errors.isEmpty()) {
    // There are validation errors, render the form with errors
    res.render('hello-world', { errors: errors.array() });
  } else {
    // No validation errors, proceed with rendering the form data
    const email = req.body.email;
    res.render('form-data', {
      email: email,
      allData: req.body
    });
  }
});
module.exports = router;