var express = require('express');
var router = express.Router();


const { validationResult } = require('express-validator');
const {validateEmail,validatePassword} = require('./customValidators')

router.get('/', function(req, res) {


  res.render("hello-world", { errors: [] });


});

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
      // No validation errors, proceed with rendering the form data
      const email = req.body.email;
      res.render('form-data', {
        email,
        allData: req.body
      });
    }
  });
 


module.exports = router;