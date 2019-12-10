// ***** PLUS BESOIN CAR ON VA MAINTENANT TRAVAILLER AVEC UNE BASE DE DONNEE *****
// **
// **
// On importe file system pour stocker nos produits dans un fichier et non plus dans un array
// const fs = require('fs');
// const path = require('path');

// On importe notre bdd
const db = require('../util/database');
const Cart = require('./cart');

// ***** PLUS BESOIN CAR ON VA MAINTENANT TRAVAILLER AVEC UNE BASE DE DONNEE *****
// **
// **
// Helper function pour le path
// Ici on veut sauvegarder nos produits dans un fichier .json à l'interieur du dossier data au niveau de notre app (stocké dans notre variable p)
// const p = path.join(
//   path.dirname(process.mainModule.filename),
//   'data',
//   'product.json'
// );

// ***** PLUS BESOIN CAR ON VA MAINTENANT TRAVAILLER AVEC UNE BASE DE DONNEE *****
// **
// **
// Helper function
// const getProductsFromFile = callback => {
//   // On veut lire le fichier JSON
//   fs.readFile(p, (err, fileContent) => {
//     // S'il y a rien on veut quand même retourner quelque chose (un array vide ici)
//     if (err) {
//       callback([]);
//     } else {
//       // Sinon on retourne notre contenu parsé (sous forme de tableau js)
//       callback(JSON.parse(fileContent));
//     }
//   });
// };

module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  // Méthode pour sauvegarder les produits
  save() {
    // Les champs doivent être nommés indentiquement à ceux défini dans la bdd
    // On utilise ?, ?, ?, ? pour ce protéger des injections SQL (il doit y avoir autant de ? que de champs)
    // On précise ensutie dans l'array à quoi vont correspondre les ?
    return db.execute(
      'INSERT INTO products (title, price, imageUrl, description) VALUES (?, ?, ?, ?)',
      [this.title, this.price, this.imageUrl, this.description]
    );

    // ***** PLUS BESOIN CAR ON VA MAINTENANT TRAVAILLER AVEC UNE BASE DE DONNEE *****
    // **
    // **
    // On récupère les produits qui sont dans le fichier JSON
    // getProductsFromFile(products => {
    //   // Ici on vérifie si un id existe déjà (ce qui voudrai dire qu'on EDIT un produit qui est déjà stocké)
    //   if (this.id) {
    //     // Ensuite on retrouve le produit qui correspond à cet id
    //     const existingProductIndex = products.findIndex(
    //       prod => prod.id === this.id
    //     );
    //     // Maintenant on on fait une copie de notre tableau de produits
    //     const updatedProducts = [...products];
    //     // Et ensuite grâce à l'index on remplace le produit initial par le produit édité
    //     updatedProducts[existingProductIndex] = this;
    //     // On termine par le ré écrire dans le fichier JSON
    //     fs.writeFile(p, JSON.stringify(updatedProducts), err => {
    //       console.log(err);
    //     });
    //   } else {
    //     // On ajoute un id unique à chaque nouveau produit
    //     this.id = Math.random().toString();
    //     // On ajoute le nouveau produit au tableau products
    //     products.push(this);
    //     // Ici on va enregistre/écrit le produit dans le fichier JSON
    //     // On doit donc transformer l'array/obj... javascript en JSON grâce à stringify
    //     fs.writeFile(p, JSON.stringify(products), err => {
    //       console.log(err);
    //     });
    //   }
    // });
  }

  static deleteById(id) {
    // ***** PLUS BESOIN CAR ON VA MAINTENANT TRAVAILLER AVEC UNE BASE DE DONNEE *****
    // **
    // **
    // getProductsFromFile(products => {
    //   // On enregistre le produit a delete dans une variable en matchant les id
    //   const product = products.find(
    //     prod => prod.id === id
    //   );
    //   // Ici on va filtrer avec l'id du produit qu'on veut delete
    //   // filter va créer un nouveau tableau avec tous les produits dont l'id NE MATCH PAS (donc le produit qu'on veux suppr n'est plus dans ce tableau)
    //   const updatedProducts = products.filter(
    //     prod => prod.id !== id
    //   );
    //   // Miantenant on va donc ré écrire le fichier JSON avec le nouveau tableau de produit qui ne contient plus celui qu'on veut suppr
    //   fs.writeFile(
    //     p,
    //     JSON.stringify(updatedProducts),
    //     err => {
    //       if (!err) {
    //         // Ici on va aussi enlever le produit du panier (cart) s'il n'y a pas d'erreur
    //         // On déclenche donc la méthode deleteproduct du model Cart qui prend en arg l'id et le prix du produit
    //         Cart.deleteProduct(id, product.price);
    //       }
    //     }
    //   );
    // });
  }

  // Méthode pour "charger" nos produits
  static fetchAll(/*callback*/) {
    // On fetch tous nos produits stockés dans la bdd (ce code retourne une promesse)
    return db.execute('SELECT * FROM products');

    // ***** PLUS BESOIN CAR ON VA MAINTENANT TRAVAILLER AVEC UNE BASE DE DONNEE *****
    // **
    // **
    // getProductsFromFile(callback);
  }

  static findById(id /*, callback*/) {
    return db.execute(`SELECT * FROM products WHERE id=${id}`);
    // ***** PLUS BESOIN CAR ON VA MAINTENANT TRAVAILLER AVEC UNE BASE DE DONNEE *****
    // **
    // **
    // getProductsFromFile(products => {
    //   // Ici on récupère nos produits avec getProductsFromFile
    //   // Et on y passe une function de callback dans laquelle on va filtrer nos produit pour trouver l'id qu'on veut
    //   const product = products.find(
    //     prod => prod.id === id
    //   );
    //   callback(product);
    // });
  }
};
