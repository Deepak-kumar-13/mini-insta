const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { ensureGuest } = require('../middlewares/authMiddleware');

router.get('/register', ensureGuest, (req, res) => {
  res.render('register');
});

router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
    
  try {
    const userExist = await User.findOne({ email });
    if (userExist) {
      req.flash('error', 'Email already registered');
      return res.redirect('/register');
    }

    const newUser = new User({ username, email, password });
    await newUser.save();
    req.flash('success', 'Registration successful. You can now login');
    res.redirect('/login');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Something went wrong');
    res.redirect('/register');
  }
});

router.get('/login', ensureGuest, (req, res) => {
  res.render('login');
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      req.flash('error', 'Invalid credentials');
      return res.redirect('/login');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      req.flash('error', 'Invalid credentials');
      return res.redirect('/login');
    }

    req.session.user = user;
    req.flash('success', 'Welcome back!');
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Something went wrong');
    res.redirect('/login');
  }
});

router.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) console.log(err);
    res.redirect('/login');
  });
});

module.exports = router;
