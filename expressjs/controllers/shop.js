// Dans ce controller on passe la logique pour les produits et on export la fonction
// pour l'utiliser dans notre route admin

// On importe le model Product
const Product = require('../models/product');
// On importe le model Cart
const Cart = require('../models/cart');

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
  // On récupère le panier
  Cart.getCart(cart => {
    // On fetch tous les produits
    Product.fetchAll(products => {
      // On instancie un array dans lequel on pushera nos produits qui font parti du panier
      const cartProducts = [];
      // On boucle sur tous nos produits
      for (product of products) {
        // On vérifi si chaque produit est dans le panier ou pas
        //(si le produit du panier à le même id que le produit sur lequel on est en train de boucler...)
        const cartProductData = cart.products.find(
          prod => prod.id === product.id
        );
        if (cartProductData) {
          // Alors on push le produit et la quantité dans notre array cartProduct
          cartProducts.push({ productData: product, qty: cartProductData.qty });
        }
      }
      res.render('shop/cart', {
        pageTitle: 'Your Cart',
        path: '/cart',
        products: cartProducts
      });
    });
  });
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId, product => {
    Cart.addProduct(prodId, product.price);
  });
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
