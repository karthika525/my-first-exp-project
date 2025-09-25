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
//Update single data
User.updateOne({ _id: '68d427c0452343fb4b3a3625'},{ email:'vshnv23@example.com' }).then(result => {console.log('Data updated successfully');})
//Update Many data
User.updateMany({ email: { $regex: /@gmail.com/ }},{ password:'newpassword' }).then(result => {console.log('Data’s updated successfully'); })

module.exports = router;