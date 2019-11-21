// On importe file system pour stocker nos produits dans un fichier et non plus dans un array
const fs = require('fs');
const path = require('path');

// Helper function pour le path
// Ici on veut sauvegarder nos produits dans un fichier .json à l'interieur du dossier data au niveau de notre app (stocké dans notre variable p)
const p = path.join(
  path.dirname(process.mainModule.filename),
  'data',
  'product.json'
);

// Helper function
const getProductsFromFile = callback => {
  // On veut lire le fichier JSON
  fs.readFile(p, (err, fileContent) => {
    // S'il y a rien on veut quand même retourner quelque chose (un array vide ici)
    if (err) {
      callback([]);
    } else {
      // Sinon on retourne notre contenu parsé (sous forme de tableau js)
      callback(JSON.parse(fileContent));
    }
  });
};

module.exports = class Product {
  constructor(title, imageUrl, description, price) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  // Méthode pour sauvegarder les produits
  save() {
    // On ajoute un id unique à chaque nouveau produit
    this.id = Math.random().toString();
    // On récupère les produits qui sont dans le fichier JSON
    getProductsFromFile(products => {
      // On ajoute le nouveau produit au tableau products
      products.push(this);
      // Ici on va enregistre/écrit le produit dans le fichier JSON
      // On doit donc transformer l'array/obj... javascript en JSON grâce à stringify
      fs.writeFile(p, JSON.stringify(products), err => {
        console.log(err);
      });
    });
  }
  // Méthode pour "charger" nos produits
  static fetchAll(callback) {
    getProductsFromFile(callback);
  }

  static findById(id, callback) {
    getProductsFromFile(products => {
      // Ici on récupère nos produits avec getProductsFromFile
      // Et on y passe une function de callback dans laquelle on va filtrer nos produit pour trouver l'id qu'on veut
      const product = products.find(prod => prod.id === id);
      callback(product);
    });
  }
};
