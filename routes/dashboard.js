const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const { ensureAuth } = require('../middlewares/authMiddleware');

router.get('/dashboard', ensureAuth, async (req, res) => {
  try {
    const posts = await Post.find().populate('user').sort({ createdAt: -1 });
    res.render('dashboard', { posts });
  } catch (err) {
    console.error(err);
    res.redirect('/login');
  }
});

module.exports = router;
