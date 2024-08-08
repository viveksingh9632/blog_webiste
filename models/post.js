const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  slug: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Refers to the "User" model
    required: true,
  },
  category_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category", // Refers to the "Category" model
    required: true,
  },
  tag_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tag", // Refers to the "User" model
    required: true,
  },


  createdAt: {
    type: Date,
    default: Date.now 
  }
});

module.exports = mongoose.model('Post', postSchema);
