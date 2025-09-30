const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const { validationResult } = require('express-validator');
const { validateEmail, validatePassword } = require('./customValidators');

const isAuthenticated = (allowedDomain) => (req, res, next) => {
  if (req.session && req.session.userEmail) {
    const userEmail = req.session.userEmail;
    console.log('User email:', userEmail);
    if (!allowedDomain || userEmail.endsWith(allowedDomain)) {
      return next();
    } else {
      return res.status(403).send('unauthorized');
    }
  }
  console.log('User email not found in session:', req.session);
  res.redirect('/login');
};

router.get('/', isAuthenticated(), (req, res) => {
  const email = req.session.userEmail || null;
  res.render("hello-world", { email });
});

router.get('/about-us', (req, res) => res.render('about-us'));

router.get('/page/:title', (req, res) => res.render('page', { str: req.params.title }));

router.get('/signup', (req, res) => res.render('signup', { message: null, error: null }));

router.post('/signup', (req, res) => {
  const { email, password, confirmPassword } = req.body;
  if (password !== confirmPassword) {
    return res.render('signup', { message: 'Password and Confirm Password do not match', error: null });
  }
  const user = new User({ email, password });
  const validationError = user.validateSync();
  if (validationError) {
    return res.render('signup', { message: null, error: validationError.errors });
  }
  User.findOne({ email })
    .then(existingUser => {
      if (existingUser) {
        return res.render('signup', { message: 'Email already taken', error: null });
      }
      return bcrypt.hash(password, 10);
    })
    .then(hashedPassword => {
      if (!hashedPassword) return;
      return new User({ email, password: hashedPassword }).save();
    })
    .then(() => res.redirect('/login'))
    .catch(error => {
      console.error(error);
      res.render('signup', { message: 'Signup failed', error: null });
    });
});

router.get('/login', (req, res) => res.render('login', { errors: [], message: null }));

router.post('/login', [validateEmail, validatePassword], (req, res) => {
  const errors = req.validationErrors || [];
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    errors.push(...validationErrors.array());
  }
  if (errors.length) {
    return res.render('login', { errors, message: null });
  }
  const { email, password } = req.body;
  let foundUser;
  User.findOne({ email })
    .then(user => {
      if (!user) {
        return res.render('login', { message: 'Incorrect Email Address.', errors: [] });
      }
      foundUser = user;
      return bcrypt.compare(password, user.password);
    })
    .then(isPasswordValid => {
      if (!isPasswordValid) {
        return res.render('login', { message: 'Incorrect password.', errors: [] });
      }
      req.session.userId = foundUser._id;
      req.session.userEmail = foundUser.email;
      res.render('hello-world', { email: foundUser.email });
    })
    .catch(error => {
      console.error(error);
      res.status(500).send('Internal Server Error');
    });
});

router.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) res.send('Error');
    else res.redirect('/login');
  });
});

router.get('/createUser', (req, res) => res.render("hello-world", { errors: [] }));

router.post('/createUser', [validateEmail, validatePassword], (req, res) => {
  const errors = req.validationErrors || [];
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    errors.push(...validationErrors.array());
  }
  if (errors.length) {
    return res.render('hello-world', { errors, email: req.body.email });
  }
  const { email, password } = req.body;
  new User({ email, password }).save()
    .then(() => res.render('form-data', { message: "Data saved to db" }))
    .catch(error => {
      console.error(error);
      res.render('hello-world', { errors: [{ msg: "Failed to save data" }] });
    });
});

router.get('/getUser', (req, res) => {
  User.find()
    .then(data => res.render('index', { data }))
    .catch(error => {
      console.error(error);
      res.status(500).send("Error retrieving users");
    });
});

module.exports = router;
