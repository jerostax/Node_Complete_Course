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
    required: true
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

// On créé un model avec mongoose qu'on nomme ici Product
// Le deuxieme argument représente le scehma qu'on va utiliser pour définir le modele
module.exports = mongoose.model('Product', productSchema);
