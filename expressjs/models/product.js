// On importe file system pour stocker nos produits dans un fichier et non plus dans un array
const fs = require('fs');
const path = require('path');

module.exports = class Product {
  constructor(t) {
    this.title = t;
  }

  // Méthode pour sauvegarder les produits
  save() {
    // Ici on veut sauvegarder nos produits dans un fichier .json à l'interieur du dossier data au niveau de notre app (stocké dans notre variable p)
    const p = path.join(
      path.dirname(process.mainModule.filename),
      'data',
      'product.json'
    );
    // Ici on dit qu'on veut lire le fichier qui se trouve dans le path "p" (voir const jsute au dessus)
    // On aura ou une erreur ou le contenu du fichier
    fs.readFile(p, (err, fileContent) => {
      console.log(fileContent);
      let products = [];
      // S'il n'y a pas d'errur alors on veut lire le produit depuis le fichier JSON
      // On doit donc parse le fichier pour qu'il transforme le json en un tableau/obj javascript
      if (!err) {
        products = JSON.parse(fileContent);
      }
      // On ajoute le nouveau produit au tableau products
      products.push(this);
      // Ici on va enregistre le produit dans le fichier JSON
      // On doit donc transformer l'array/obj... javascript en JSON grâce à stringify
      fs.writeFile(p, JSON.stringify(products), err => {
        console.log(err);
      });
    });
  }
  // Méthode pour "charger" nos produits
  static fetchAll(callback) {
    const p = path.join(
      path.dirname(process.mainModule.filename),
      'data',
      'product.json'
    );
    // On veut lire le fichier JSON
    fs.readFile(p, (err, fileContent) => {
      // S'il y a rien on veut quand même retourner quelque chose (un array vide ici)
      if (err) {
        callback([]);
      }
      // Sinon on retourne notre contenu parsé (sous forme de tableau js)
      callback(JSON.parse(fileContent));
    });
  }
};
