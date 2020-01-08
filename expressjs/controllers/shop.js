const fs = require('fs');
const path = require('path');

const PDFDocument = require('pdfkit');

const Product = require('../models/product');
const Order = require('../models/order');

const ITEMS_PER_PAGE = 2;

exports.getProducts = (req, res, next) => {
  // **** Code sans mongoose ****
  // *
  // Ici on utilise la méthode fetchAll() définie dans le modèle Product
  // Product.fetchAll()
  // *

  // find() nous est fourni par mongoose et nous donne tous nos produits
  const page = +req.query.page || 1;
  let totalItems;

  Product.find()
    .countDocuments()
    .then(numProducts => {
      totalItems = numProducts;
      return Product.find()
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);
    })
    .then(products => {
      // console.log((page - 1) * ITEMS_PER_PAGE);
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'Products',
        path: '/products',
        currentPage: page,
        // Ici on passe l'information du nombre de produits total que l'on a
        // totalProducts: totalItems,
        // Ici on check si on a plus d'items au total que sur la page ou l'on est actuellement
        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
        // La on check si la page sur laquelle on est et plus grande que 1, si c'est le cas il y a bien une previous page
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        // Caclul simple pour trouver la dernière page, nombre total d'items divisé par nombre d'item par page = nombre de pages total
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
        // **** Code avant de refacto isAuth et crsfToken sur toutes les pages ****
        // *
        // isAuthenticated: req.session.isLoggedIn,
        // // La méthode csrfToken() est fournie par le csrf middleware du package csurf
        // // Ici on le rend donc utilisable dans la view
        // csrfToken: req.csrfToken()
        // *
      });
    })
    .catch(err => {
      // Ici on créé une nouvelle erreur avec le status 500 (server error)
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
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
    .catch(err => {
      // Ici on créé une nouvelle erreur avec le status 500 (server error)
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getIndex = (req, res, next) => {
  // **** Code sans mongoose ****
  // *
  // Ici on utilise la méthode fetchAll() définie dans le modèle Product
  // Product.fetchAll()
  // *

  // Ici on accède au query nommé page
  // on précise || 1 si on a pas le numéro de la page quand on arrive la première fois sur juste '/' par exemple
  const page = +req.query.page || 1;
  let totalItems;

  Product.find()
    .countDocuments()
    .then(numProducts => {
      totalItems = numProducts;
      return Product.find()
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);
    })
    // **** Code avant de countDocuments() les produits
    // *
    // Product.find()
    //   // Ici un calcul que je comprend pas bien qui va "skip" les premiers résultats
    //   // Le numéro de la page précédente (page - 1) fois le nombre d'items par page
    //   // Donc si je suis sur la page 2, on va faire page - 1 = 1, fois items par page = 2
    //   // page 3, page - 1 = 2, fois items par page = 4
    //   .skip((page - 1) * ITEMS_PER_PAGE)
    //   // Ici on précise la limite d'items par page
    //   .limit(ITEMS_PER_PAGE)
    // *
    .then(products => {
      // console.log((page - 1) * ITEMS_PER_PAGE);
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/',
        currentPage: page,
        // Ici on passe l'information du nombre de produits total que l'on a
        // totalProducts: totalItems,
        // Ici on check si on a plus d'items au total que sur la page ou l'on est actuellement
        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
        // La on check si la page sur laquelle on est et plus grande que 1, si c'est le cas il y a bien une previous page
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        // Caclul simple pour trouver la dernière page, nombre total d'items divisé par nombre d'item par page = nombre de pages total
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
        // **** Code avant de refacto isAuth et crsfToken sur toutes les pages ****
        // *
        // isAuthenticated: req.session.isLoggedIn,
        // // La méthode csrfToken() est fournie par le csrf middleware du package csurf
        // // Ici on le rend donc utilisable dans la view
        // csrfToken: req.csrfToken()
        // *
      });
    })
    .catch(err => {
      // Ici on créé une nouvelle erreur avec le status 500 (server error)
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
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
    .catch(err => {
      // Ici on créé une nouvelle erreur avec le status 500 (server error)
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
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
    .catch(err => {
      // Ici on créé une nouvelle erreur avec le status 500 (server error)
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
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
    .catch(err => {
      // Ici on créé une nouvelle erreur avec le status 500 (server error)
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
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
          // name: req.user.name,
          email: req.user.email,
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
    .catch(err => {
      // Ici on créé une nouvelle erreur avec le status 500 (server error)
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getOrders = (req, res, next) => {
  // Ici on find() les orders qui ont le même userId que l'id du user qui fait la requête
  Order.find({ 'user.userId': req.user._id })
    .then(orders => {
      res.render('shop/orders', {
        pageTitle: 'Your Orders',
        path: '/orders',
        // ES6 SYNTAXE
        orders
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

    .catch(err => {
      // Ici on créé une nouvelle erreur avec le status 500 (server error)
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    pageTitle: 'Checkout',
    path: '/checkout'
  });
};

exports.getInvoice = (req, res, next) => {
  const orderId = req.params.orderId;
  Order.findById(orderId)
    .then(order => {
      if (!order) {
        return next(new Error('No order found.'));
      }
      // Ici on check si le userId de l'order n'est pas égal à l'id du user logged in
      if (order.user.userId.toString() !== req.user._id.toString()) {
        return next(new Error('Unauthorized'));
      }
      // Si on passe les 2 if alors on va lire le fichier et l'ouput
      const invoiceName = 'invoice-' + orderId + '.pdf';
      const invoicePath = path.join('data', 'invoices', invoiceName);

      const pdfDoc = new PDFDocument();
      res.setHeader('Content-type', 'application/pdf');
      res.setHeader('Content-disposition', `inline; filename=${invoiceName}`);
      // Ici on écrits/créé un stream pour le nouveau pdf et on lui met le path où on veux le store
      pdfDoc.pipe(fs.createWriteStream(invoicePath));
      pdfDoc.pipe(res);

      pdfDoc.fontSize(26).text('Invoice', {
        underline: true
      });

      pdfDoc.text('----------------------');
      let totalPrice = 0;
      order.products.forEach(prod => {
        totalPrice += prod.quantity * prod.product.price;
        pdfDoc
          .fontSize(14)
          .text(
            prod.product.title +
              ' - ' +
              prod.quantity +
              ' x ' +
              prod.product.price +
              ' €'
          );
      });
      pdfDoc.text('-----');
      pdfDoc.fontSize(20).text('Total Price: ' + totalPrice + ' €');
      pdfDoc.end();

      // **** Code avant de stream la réponse ****
      // *
      // Ici on va lire l'invoice grâce au core module filesystem auquel on passe le path
      // fs.readFile(invoicePath, (err, data) => {
      //   if (err) {
      //     return next(err);
      //   }
      //   // On renseigne au navigateur le content type
      //   res.setHeader('Content-type', 'application/pdf');
      //   // Ici on configure le nom du file pour le navigateur
      //   res.setHeader('Content-disposition', `inline; filename=${invoiceName}`);
      //   // Si y a pas d'erreur on renvoi la data
      //   res.send(data);
      // });
      // *

      // **** Code avant de write/créer un pdf ****
      // *
      // Maintenant on va lire les fichier en créant un stream pour éviter de tout lire d'un coup si fichier trop lourd
      //   const file = fs.createReadStream(invoicePath);
      //   res.setHeader('Content-type', 'application/pdf');
      //   res.setHeader('Content-disposition', `inline; filename=${invoiceName}`);
      //   file.pipe(res);
      // *
    })

    .catch(err => {
      return next(err);
    });
};
