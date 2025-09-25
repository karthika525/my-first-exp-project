var express = require('express');
var router = express.Router();
const User = require('../models/userModel'); // import model

// for getting data from db
router.get('/getUser', function (req,res) {
  User.find()
    .then(data => {
      res.render('index', { data });
    })
    .catch(error => {
      console.error(error);
      res.status(500).send("Error fetching users");
    });
});

//Get a data as model object using Id
const userId = '68d427c0452343fb4b3a3625'; // Replace with the actual user ID you want to find


  User.findById(userId)
    .then(user => {
      if (!user) {
        console.log('User not found');
        return;
      }
      console.log(user);
    })
    .catch(error => {
      console.error(error);
    });

module.exports = router;
