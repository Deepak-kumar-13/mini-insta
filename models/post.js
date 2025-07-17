const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  image: {
    type: String,
    required: true
  },
  caption: {
    type: String
  },
  likes: {
    type: [String],
    default: []
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Post', PostSchema);
