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


module.exports = router;
