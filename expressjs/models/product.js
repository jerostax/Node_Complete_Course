const mongoose = require('mongoose');

// Le constructor Schema de mongoose nous permet de construire de nouveau schemas
const Schema = mongoose.Schema;

const productSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: TextTrackCue
  },
  description: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  }
});
