var express = require('express');
var router = express.Router();
const User = require('../models/userModel');


router.get('/createUser', (req, res) => {
  const newUser = new User({
    email: 'abcd12@gmail.com',
    password: '12345',
  });

  newUser.save()
    .then(() => {
      res.send('User created');
    })
    .catch((error) => {
      console.error(error);
      
    });
});

module.exports = router;
