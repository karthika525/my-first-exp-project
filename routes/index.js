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
//Delete single data
User.deleteOne({ _id: '68d56bbf776be9718775557b'}).then(result => { console.log('Data deleted successfully');})
//Delete Many data
User.deleteMany({ email: { $regex: /@gmail.com/ } }).then(result => {console.log('Data’s deleted successfully');  })

module.exports = router;