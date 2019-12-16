const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;
class User {
  constructor(username, email, cart, id) {
    this.name = username;
    this.email = email;
    this.cart = cart; // {items: []}
    this._id = id;
  }
  save() {
    const db = getDb();
    return db
      .collection('users')
      .insertOne(this)
      .then(result => console.log(result))
      .catch(err => console.log(err));
  }

  addToCart(product) {
    // Ici on stock dans cartProduct si il y a déjà un produit avec le même id dedans ou pas
    // const cartProduct = this.cart.items.findIndex(cp => cp._id === product._id);

    // Ici on update le panier avec l'id du produit et on y rajoutant une valeur quantity de 1
    const updatedCart = {
      items: [{ productId: new mongodb.ObjectId(product.id), quantity: 1 }]
    };
    const db = getDb();
    // Mtn on utilise la méthode updateOne() pour mettre à jour le panier
    return db
      .collection('users')
      .updateOne(
        { _id: new mongodb.ObjectId(this._id) },
        { $set: { cart: updatedCart } }
      );
  }

  static findById(userId) {
    const db = getDb();
    return db
      .collection('users')
      .find({ _id: new mongodb.ObjectId(userId) })
      .next()
      .then(user => {
        console.log(user);
        return user;
      })
      .catch(err => console.log(err));
  }
}

module.exports = User;
