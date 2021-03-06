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
        productId: new mongodb.ObjectId(product._id),
        quantity: newQuantity
      });
    }

    // Ici j'enregistre le panier avec ces items updaté
    const updatedCart = {
      items: updatedCartItems
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

  getCart() {
    const db = getDb();
    const productIds = this.cart.items.map(i => {
      return i.productId;
    });
    // On utilise l'opérateur de mongoDB $in pour matcher les id
    // Ca nous permet donc de retourner tous les produits de la collection products qui ont le même id que ceux dans le panier (cart)
    return db
      .collection('products')
      .find({ _id: { $in: productIds } })
      .toArray()
      .then(products => {
        // Ensuite on veut mapper sur tous ces produits pour y ajouter leur quantité
        return products.map(p => {
          // On copie donc chaque objet produit et on lui rajouter la quantité qu'on a dans le cart.item
          return {
            ...p,
            quantity: this.cart.items.find(i => {
              return i.productId.toString() === p._id.toString();
            }).quantity // a la fin c'est la quantité de chaque produit qu'on retourne
          };
        });
      });
  }

  deleteItemFromCart(productId) {
    // filter() retourne un nouveau tableau avec les éléments correspondant au filtre (ici l'id)
    // on retourne uniquement les produits qui matchent pas avec l'id de celui qu'on veux delete
    const updatedCartItems = this.cart.items.filter(item => {
      return item.productId.toString() !== productId.toString();
    });
    // On a plus qu'a update les items du cart en bdd
    const db = getDb();
    return db
      .collection('users')
      .updateOne(
        { _id: new mongodb.ObjectId(this._id) },
        { $set: { cart: { items: updatedCartItems } } }
      );
  }

  addOrder() {
    const db = getDb();
    // On utilise la méthode getCart() de notre classe pour récupérer les datas du panier
    return this.getCart()
      .then(products => {
        const order = {
          items: products,
          user: {
            _id: new mongodb.ObjectID(this._id),
            name: this.username
          }
        };
        // On ajoute notre variable order qui contient le détails des produits et l'utilisateur attaché
        return db.collection('orders').insertOne(order);
      })

      .then(result => {
        // Une fois qu'on a ajouté le panier en commande (order), on le vide de ses items
        this.cart = { items: [] };
        // On vide le panier en bdd également
        return db
          .collection('users')
          .updateOne(
            { _id: new mongodb.ObjectID(this._id) },
            { $set: { cart: { items: [] } } }
          );
      });
  }

  getOrders() {
    const db = getDb();
    // le filtre 'user._id' va chercher à l'interieur de la collection, le champs _id dans le champs user
    // On filtre donc pour trouver l'order qui a un id user égale à l'id du user
    return db
      .collection('orders')
      .find({ 'user._id': new mongodb.ObjectID(this._id) })
      .toArray();
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
