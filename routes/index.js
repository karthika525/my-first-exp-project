var express = require('express');
var router = express.Router();
const User = require('../models/userModel');
const { validationResult } = require('express-validator');
const {validateEmail,validatePassword} = require('./customValidators')


router.get('/', function(req, res) {
res.render("hello-world", { errors: [] });
});
//route for handling form submission with validations
router.post('/createUser', [
  // Add custom validation that required/imported
    validateEmail,
    validatePassword
  ], function (req, res) {
    // Access the validation errors from the request object
    const errors = req.validationErrors || [];
     // Validate the request
    const validationResultErrors = validationResult(req);
    if (!validationResultErrors.isEmpty()) {
      // Merge the errors from validation result into the existing errors
      errors.push(...validationResultErrors.array());
    }
    if (errors.length > 0) {
      // There are validation errors, render the form with errors
      res.render('hello-world', { errors, email: req.body.email });
    } else {
      const { email, password } = req.body;
      // Create a new User object
      const newUser = new User({
      email,
      password,
      });
      // Save the User object to the database
    newUser.save()
      .then(() => {
      res.render('form-data',{
        message:"Data saved to db"
      });
      })
      .catch((error) => {
      console.error(error);
      
      });
    }
  });
// for getting data from db
router.get('/getUser', function (req,res) {
     User.find().then(data => {
         res.render('index', {data:data})
  }).catch(error => {
      console.error(error);
      
    });
  })
//for about-us page
  router.get('/about-us', function (req,res) {
    res.render('about-us')
  })
module.exports = router;