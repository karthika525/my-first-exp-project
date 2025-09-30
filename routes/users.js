var express = require('express');
var router = express.Router();
const User = require('../models/userModel');
const multer = require('multer');
const UserProfile = require('../models/fileUpload');

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
// GET route to show the form
router.get('/create_profile', (req, res) => {
  res.render('fileUpload');
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


router.post('/create_profile', upload.single('display_picture'), (req, res) => {
  const { fname, lname, technologies, email } = req.body;
  const display_picture = req.file.buffer.toString('base64');


  // Create the user profile
  const userPr = new UserProfile({
    fname,
    lname,
    technologies,
    email,
    display_picture
  });


  // Save the user profile and handle success or error
  userPr.save()
    .then(() => {
      res.status(200).send('File uploaded successfully');
    })
    .catch((error) => {
      console.error('Error uploading file:', error);
      res.status(500).send('Internal Server Error');
    });
});
module.exports = router;
