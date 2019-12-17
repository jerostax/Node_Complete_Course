const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  // Ici on défini ce qu'il y a dans le panier, notamment le productId de type ObjectId
  // On définit aussi la référence au modele qui nous interesse, ici Product
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true
        },
        quantity: { type: Number, required: true }
      }
    ]
  }
});

module.exports = mongoose.model('User', userSchema);
