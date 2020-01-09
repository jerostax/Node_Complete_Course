const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    imageUrl: {
      type: String,
      required: true
    },
    content: {
      type: String,
      reuired: true
    },
    creator: {
      type: Object,
      required: String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Post', postSchema);