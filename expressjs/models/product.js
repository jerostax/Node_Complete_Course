const getDb = require('../util/database').getDb;

class Product {
  // On définit les "champs" de notre modele product dans le constructor
  constructor(title, price, description, imageUrl) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
  }

  save() {
    // On enregistre la connexion à notre bdd
    const db = getDb();
    // On dit à mongoDB avec quelle collection on veux travailler (si elle existe pas elle sera créée automatiquement)
    // On utilise la méthode insertOne() (existe aussi insertMany) pour insérer un nouveau produit dans la collection
    // On y insert donc 'this' qui représente notre title/price/description/imageUrl d'un product
    return db
      .collection('products')
      .insertOne(this)
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
}

module.exports = Product;
