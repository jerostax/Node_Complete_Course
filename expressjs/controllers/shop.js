// Dans ce controller on passe la logique pour les produits et on export la fonction
// pour l'utiliser dans notre route admin

// On importe le model Product
const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
  // On passe notre code en callback de la fonction fetchAll à cause du comportement asynchrone de la méthode fetchAll dans le model Product
  Product.fetchAll(products => {
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'All Products',
      path: '/products'
      // Le code ci-dessous servait pour le template engine handlebars qui ne gère pas le js dans le template
      // hasProducts: products.length > 0,
      // activeShop: true,
      // productCSS: true
    });
  });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  console.log(
    Product.findById(prodId, product => {
      console.log(product);
      res.render('shop/product-detail', {
        product,
        pageTitle: product.title,
        path: '/products'
      });
    })
  );
};

exports.getIndex = (req, res, next) => {
  Product.fetchAll(products => {
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/'
    });
  });
};

exports.getCart = (req, res, next) => {
  res.render('shop/cart', {
    pageTitle: 'Your Cart',
    path: '/cart'
  });
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  console.log(prodId);
  res.redirect('/cart');
};

exports.getOrders = (req, res, next) => {
  res.render('shop/orders', {
    pageTitle: 'Your Orders',
    path: '/orders'
  });
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    pageTitle: 'Checkout',
    path: '/checkout'
  });
};
