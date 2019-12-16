const mongodb = require('mongodb');

const getDb = require('../util/database').getDb;

class Product {
  // On définit les "champs" de notre modele product dans le constructor
  constructor(title, price, description, imageUrl, id) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
    // Ici on utilise new mongodb.ObjectId pour être capable de comparer les 2 id,
    // car l'id stocké dans mongodb est sous formee d'ObjectId (un objet propre à mongodb)
    // On check avec une condition ternaire si il existe déjà un id, sinon on set à null pour éviter de faire bugger la condition qui check l'id dans la méthode save()
    this._id = id ? new mongodb.ObjectId(id) : null;
  }

  save() {
    // On enregistre la connexion à notre bdd
    const db = getDb();
    // dbOp = databse operation
    let dbOp;
    // On check si le produit existe déjà et dans ce cas la on va l'update/edit
    if (this._id) {
      // On enregistre la connexion dans un autre variable dbOp déclarée plus haut
      dbOp = db
        // On dit à mongoDB avec quelle collection on veux travailler (si elle existe pas elle sera créée automatiquement)
        // On utilise la méthode insertOne() (existe aussi insertMany) pour insérer un nouveau produit dans la collection
        // On y insert donc 'this' qui représente notre title/price/description/imageUrl d'un product
        .collection('products')
        // Dans ce cas, on utilise la méthode updateOne() de mongodb pour mettre à jour le product
        // En premier argument on check l'id
        // En deuxième argument, on utilise une annotation particulière à mongodb ($set) et on lui dit de "set" les "champs" de la collection product avec toutes nos propriété de this
        .updateOne({ _id: this._id }, { $set: this });
    } else {
      // On enregistre la connexion dans un autre variable dbOp déclarée plus haut
      // Ici on va créer un nouveau produit donc pas besoin de check l'id comme plus haut
      dbOp = db.collection('products').insertOne(this);
    }

    return dbOp
      .then(result => console.log(result))
      .catch(err => console.log(err));
  }

  static fetchAll() {
    const db = getDb();
    // On utilise la méthode find() de mongodb pour trouver tous les produits
    // Ensuite on dit de transformer tous les documents qu'on retrouve en un objet javascript (toArray())
    return db
      .collection('products')
      .find()
      .toArray()
      .then(products => {
        console.log(products);
        return products;
      })
      .catch(err => console.log(err));
  }

  static findById(prodId) {
    const db = getDb();
    // On utilise mtn la méthode find() mais avec un filtre qui chercher l'id correspondant
    // on utilise next() pour dire à mongoDB qu'on veut le premier document retourné par la méthode find()
    return db
      .collection('products')
      .find({ _id: new mongodb.ObjectID(prodId) })
      .next()
      .then(product => {
        console.log(product);
        return product;
      })
      .catch(err => console.log(err));
  }

  static deleteById(prodId) {
    const db = getDb();
    return db
      .collection('products')
      .deleteOne({ _id: new mongodb.ObjectID(prodId) })
      .then(result => {
        console.log('Product deleted !');
      })
      .catch(err => console.log(err));
  }
}

module.exports = Product;
