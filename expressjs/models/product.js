const products = [];

module.exports = class Product {
  constructor(t) {
    this.title = t;
  }
  // Méthode pour sauvegarder les produits
  save() {
    products.push(this);
  }
  // Méthode pour "charger" nos produits
  static fetchAll() {
    return products;
  }
};
