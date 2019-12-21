const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  // name: {
  //   type: String,
  //   required: true
  // },
  email: {
    type: String,
    required: true
  },
  password: {
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

// methods est un objet qui nous permet d'ajouter nos propres méthodes
// !!!!! Ca doit obligatoirement être une function(){} pour que le this fasse référence à notre schema
userSchema.methods.addToCart = function(product) {
  // Ici on stock dans cartProduct si il y a déjà un produit avec le même productId dans le panier (cart) ou pas
  const cartProductIndex = this.cart.items.findIndex(
    // note: quand on récupère l'id du user via la l'objet request, il est automatiquement converti en string (pas besoin de convertir en ObjectId())
    // Néanmoins il a pas le type string, donc on le converti avec toString()
    cp => {
      return cp.productId.toString() === product._id.toString();
    }
  );
  let newQuantity = 1;

  // On fait une copie du tableau cart.items
  const updatedCartItems = [...this.cart.items];

  // On vérifie si cartProduct n'est pas négatif (-1 qui voudrait dire qu'il y a pas l'index recherché)
  if (cartProductIndex >= 0) {
    // Si c'est le cas donc, augmente la quantité de 1 (en retrouvant toujours grâce à l'id/index de l'item dans le panier)
    newQuantity = this.cart.items[cartProductIndex].quantity + 1;
    // On assigne la nouvelle quantité dans la copie du tableau faites précédement
    updatedCartItems[cartProductIndex].quantity = newQuantity;
  } else {
    // Si il existait pas déjà un product avec l'index recherché, alors on push le nouveau product dans la copie du tableau items
    updatedCartItems.push({
      productId: product._id,
      quantity: newQuantity
    });
  }

  // Ici j'enregistre le panier avec ces items updaté
  const updatedCart = {
    items: updatedCartItems
  };
  // Mtn on met à jour le panier
  this.cart = updatedCart;
  // Puis on save() le panier à jour
  return this.save();
};

userSchema.methods.removeFromCart = function(productId) {
  // filter() retourne un nouveau tableau avec les éléments correspondant au filtre (ici l'id)
  // on retourne uniquement les produits qui matchent pas avec l'id de celui qu'on veux delete
  const updatedCartItems = this.cart.items.filter(item => {
    return item.productId.toString() != productId.toString();
  });
  // Enfin on update le panier avec le nouveau sans le produit deleted et on save() le tout
  this.cart.items = updatedCartItems;
  return this.save();
};

userSchema.methods.clearCart = function() {
  // Ici on vide simplement le panier
  this.cart = { items: [] };
  return this.save();
};

module.exports = mongoose.model('User', userSchema);
