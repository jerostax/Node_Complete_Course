const fs = require('fs');
const path = require('path');

const p = path.join(
  path.dirname(process.mainModule.filename),
  'data',
  'cart.json'
);

module.exports = class Cart {
  static addProduct(id, productPrice) {
    // 'charge' le dernier panier
    fs.readFile(p, (err, fileContent) => {
      let cart = { products: [], totalPrice: 0 };
      if (!err) {
        cart = JSON.parse(fileContent);
      }
      // analyse le panier pour voir si le produit n'est pas déjà dedans
      const existingProductIndex = cart.products.findIndex(
        prod => prod.id === id
      );
      const existingProduct = cart.products[existingProductIndex];
      let updatedProduct;
      // Ajoute le nouveau produit ou augmente la quantité si le produit était déjà présent
      if (existingProduct) {
        // On créé une variable updatedProduct dans laquelle on copie le produit déjà existant grâce a l'index passé plus haut
        updatedProduct = { ...existingProduct };
        // A partir de cette copie de tableau, on incrémente la propriété quantité du produit de 1
        updatedProduct.qty = updatedProduct.qty + 1;
        // Ensuite on créé une copie  du tableau contenant tous nos produits
        cart.products = [...cart.products];
        // A partir de cette copie, on cherche le produit déjà présent grâce à son index et on le remplace par le produit updated (avec une quantité incrémentée)
        cart.products[existingProductIndex] = updatedProduct;
      } else {
        // Je pourrai utiliser syntaxe ES6 pour id mais je laisse comme ca pour qu'on se rende bien compte
        // La on créé donc un nouveau produit puisqu'il n'existe pas encore dans notre panier (on le stock dans la variable updatedProduct)
        // On peut ainsi lui rajouter une propriété quantité de 1 et un id dans le panier égale à son id de produit
        updatedProduct = { id: id, qty: 1 };
        // Enfin on fait une copie du tableau content nos produit et on y ajoute le nouveau produit updatedProduct
        cart.products = [...cart.products, updatedProduct];
      }
      // Enfin ici on calcule le prix total du panier en additionant ce qu'il y a déjà dedans + le nouveau produit qu'on y ajoute
      // le '+' devant productPrice converti le prix string en number
      cart.totalPrice = cart.totalPrice + +productPrice;
      // Enfin on 'écrit/enregistre" le nouveau produit dans notre panier cart sous forme de JSON
      fs.writeFile(p, JSON.stringify(cart), err => {
        console.log(err);
      });
    });
  }

  static deleteProduct(id, productPrice) {
    fs.readFile(p, (err, fileContent) => {
      if (err) {
        // S'il y a une erreur c'est qu'il n'y a aucun produit dans le panier donc on peut return
        return;
      }
      // Sinon on fait une copie du panier (tableau cart)
      const updatedCart = { ...JSON.parse(fileContent) };
      // Maintenant on chercher le produit qu'on veut delete et donc qui match avec l'id
      const product = updatedCart.products.find(prod => prod.id === id);
      // Si on a pas de produit qui match avec le panier on s'arrête
      if (!product) {
        return;
      }
      // On stock la quantité du produit dans une variable
      const productQty = product.qty;
      // Ici on enl-ve le produit qu'on veut supprimer grâce à filter qui va copier le tableau avec tous les produits qui ne matchent pas l'id
      updatedCart.products = updatedCart.products.filter(
        prod => prod.id !== id
      );
      // Maintenant pour update le prix du panier, on soustrait le prix actuel par le prix du produit x sa quantité
      updatedCart.totalPrice =
        updatedCart.totalPrice - productPrice * productQty;

      // Pour terminer on va réécrire le panier avec le nouveau prix total et sans le produit qu'on a delete
      fs.writeFile(p, JSON.stringify(updatedCart), err => {
        console.log(err);
      });
    });
  }

  static getCart(callback) {
    fs.readFile(p, (err, fileContent) => {
      const cart = JSON.parse(fileContent);
      if (err) {
        callback(null);
      } else {
        callback(cart);
      }
    });
  }
};
