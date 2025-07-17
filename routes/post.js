const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Post = require('../models/Post');
const { ensureAuth } = require('../middlewares/authMiddleware');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

router.get('/upload', ensureAuth, (req, res) => {
  res.render('upload');
});

router.post('/upload', ensureAuth, upload.single('image'), async (req, res) => {
  try {
    const newPost = new Post({
      image: '/uploads/' + req.file.filename,
      caption: req.body.caption,
      user: req.session.user._id
    });

    await newPost.save();
    req.flash('success', 'Post uploaded successfully');
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Failed to upload');
    res.redirect('/post/upload');
  }
});

router.post('/like/:id', ensureAuth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const username = req.session.user.username;

    if (!post.likes.includes(username)) {
      post.likes.push(username);
    } else {
      post.likes = post.likes.filter(user => user !== username);
    }

    await post.save();
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Could not like/unlike');
    res.redirect('/dashboard');
  }
});

router.get('/profile', ensureAuth, async (req, res) => {
  try {
    const userId = req.session.user._id;
    const posts = await Post.find({ user: userId }).sort({ createdAt: -1 });
    res.render('profile', { posts });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Failed to load profile');
    res.redirect('/dashboard');
  }
});

router.get('/dashboard', ensureAuth, async (req, res) => {
  const posts = await Post.find().populate('user').sort({ createdAt: -1 });
  res.render('dashboard', { posts });
});

module.exports = router;
