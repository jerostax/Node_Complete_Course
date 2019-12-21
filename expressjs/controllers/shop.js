const Product = require('../models/product');
const Order = require('../models/order');

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
        path: '/products',
        isAuthenticated: req.session.isLoggedIn
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
        path: '/products',
        isAuthenticated: req.session.isLoggedIn
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
        // **** Code avant de refacto isAuth et crsfToken sur toutes les pages ****
        // *
        // isAuthenticated: req.session.isLoggedIn,
        // // La méthode csrfToken() est fournie par le csrf middleware du package csurf
        // // Ici on le rend donc utilisable dans la view
        // csrfToken: req.csrfToken()
        // *
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
        products,
        isAuthenticated: req.session.isLoggedIn
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
  // D'abord on récupère les products dans le panier
  req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user => {
      // Rappelons nous que nous avons la champs quantity dans les produts
      // On veux donc map dessus pour retourner un objet avec le champs quantity et le champs product qui contient les datas du product
      const products = user.cart.items.map(item => {
        // _doc nous permet d'accéder au document productId qui contient lui même le détails des produits (title, price...)
        // On fait donc une copie de l'objet productId avec le détails de ses champs
        return {
          quantity: item.quantity,
          product: { ...item.productId._doc }
        };
      });
      // Ensuite on créé un nouvel Order dans lequel on y passe les data du user et des produits du panier (qu'on a précédement stocké dans la variable products avec la quantity et les autres datas)
      // Donc ici products === products : products (la variable product au dessus)
      const order = new Order({
        user: {
          name: req.user.name,
          userId: req.user._id
        },
        products
      });
      // Enfin on utilise la méthode save() pour enregistrer le nouvel order
      return order.save();
    })
    .then(result => {
      console.log('Products added to Order');
      // On déclenche notre méthode clearCart() du modele user afin de vider le panier
      return req.user.clearCart();
    })
    .then(() => {
      res.redirect('/orders');
    })
    .catch(err => console.log(err));
};

exports.getOrders = (req, res, next) => {
  // Ici on find() les orders qui ont le même userId que l'id du user qui fait la requête
  Order.find({ 'user.userId': req.user._id })
    .then(orders => {
      res.render('shop/orders', {
        pageTitle: 'Your Orders',
        path: '/orders',
        // ES6 SYNTAXE
        orders,
        isAuthenticated: req.session.isLoggedIn
      });
    })

    // **** Ancien code sans mongoose ****
    // *
    // req.user
    //    .getOrders()

    //   .then(orders => {
    //     res.render('shop/orders', {
    //       pageTitle: 'Your Orders',
    //       path: '/orders',
    //       // ES6 SYNTAXE
    //       orders
    //     });
    //   })
    // *

    .catch(err => console.log(err));
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    pageTitle: 'Checkout',
    path: '/checkout'
  });
};
