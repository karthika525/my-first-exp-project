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
//Limit and skip
 User.find({},'email password -_id').skip(1).limit(2).then(data => {console.log(data);})
//Sorting
 User.find({},'email password -_id').skip(1).limit(2).then(data => {console.log(data);})
module.exports = router;
