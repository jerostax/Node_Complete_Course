const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
  // **** Code sans mongoose ****
  // *
  // Ici on utilise la méthode fetchAll() définie dans le modèle Product
  // Product.fetchAll()
  // *

  // find() nous est fourni par mongoose et nous donne tous nos produits
  Product.find()
    .then(products => {
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All Products',
        path: '/products'
      });
    })
    .catch(err => console.log(err));
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  // MongoDB => Ici on utilise la méthode findById() définie dans le modèle Product
  // Mongoose => La méthode findById() est fournie par mongoose
  Product.findById(prodId)
    .then(product => {
      res.render('shop/product-detail', {
        product: product,
        pageTitle: product.title,
        path: '/products'
      });
    })
    .catch(err => console.log(err));
};

exports.getIndex = (req, res, next) => {
  // **** Code sans mongoose ****
  // *
  // Ici on utilise la méthode fetchAll() définie dans le modèle Product
  // Product.fetchAll()
  // *

  Product.find()
    .then(products => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/'
      });
    })
    .catch(err => console.log(err));
};

exports.getCart = (req, res, next) => {
  req.user
    // **** Code sans mongoose ****
    // *
    // .getCart()
    // .then(products => {
    //   res.render('shop/cart', {
    //     pageTitle: 'Your Cart',
    //     path: '/cart',
    //     // ES6 SYNTAXE
    //     products
    //   });
    // })
    // *

    // Ici on dit de "populate" avec les datas de cart.items.productId, donc les datas des produits du panier
    .populate('cart.items.productId')
    // Execute le populate sur les produits du panier
    .execPopulate()
    .then(user => {
      const products = user.cart.items;
      res.render('shop/cart', {
        pageTitle: 'Your Cart',
        path: '/cart',
        // ES6 SYNTAXE
        products
      });
    })
    .catch(err => console.log(err));
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then(product => {
      // Ici on passe le product à la méthode addToCart du model user ce qui va l'ajouter au panier
      return req.user.addToCart(product);
    })
    .then(result => {
      res.redirect('/cart');
      console.log(result);
    })
    .catch(err => console.log(err));
};

exports.postCartDeleteProduct = (req, res, next) => {
  // On récupère l'id du produit
  const prodId = req.body.productId;
  req.user
    // **** Ancien code sans mongoose ****
    // *
    // Methode deleteItemFromCart définie dans notre model User
    // .deleteItemFromCart(prodId)
    // *

    .removeFromCart(prodId)
    .then(result => {
      console.log('Product deleted from the cart');
      res.redirect('/cart');
    })
    .catch(err => console.log(err));
};

exports.postOrder = (req, res, next) => {
  req.user
    // On déclenche simplement la méthode addOrder() définie dans notre model User
    .addOrder()
    .then(result => {
      console.log('Products added to Order');
      res.redirect('/orders');
    })
    .catch(err => console.log(err));
};

exports.getOrders = (req, res, next) => {
  req.user
    .getOrders()
    .then(orders => {
      res.render('shop/orders', {
        pageTitle: 'Your Orders',
        path: '/orders',
        // ES6 SYNTAXE
        orders
      });
    })
    .catch(err => console.log(err));
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    pageTitle: 'Checkout',
    path: '/checkout'
  });
};
