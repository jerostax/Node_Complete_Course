const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
  // Ici on utilise la méthode fetchAll() définie dans le modèle Product
  Product.fetchAll()
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
  // Ici on utilise la méthode findById() définie dans le modèle Product
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
  // Ici on utilise la méthode fetchAll() définie dans le modèle Product
  Product.fetchAll()
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
    .getCart()
    .then(products => {
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
    .getCart()
    .then(cart => {
      // On retourne le produit qui correspond à l'id
      return cart.getProducts({ where: { id: prodId } });
    })
    .then(products => {
      const product = products[0];
      // Ensuite on veut supprimer le produit de la table de jointure cartItem
      return product.cartItem.destroy();
    })
    .then(result => {
      console.log('Product deleted from the cart');
      res.redirect('/cart');
    })
    .catch(err => console.log(err));
};

exports.postOrder = (req, res, next) => {
  // On créé une variable pour stocker le panier
  let fetchedCart;
  req.user
    .getCart()
    .then(cart => {
      // On stock le panier dans notre variable fetchedcart
      fetchedCart = cart;
      return cart.getProducts();
    })
    .then(products => {
      // On créé une commande pour le user
      return req.user
        .createOrder()
        .then(order => {
          // On associe maintenant nos produits à la commande
          return order.addProducts(
            products.map(product => {
              // On map sur tous les produits  ajouté dans la commande (orderItem) et qui viennent du panier (cartItem) afin d'y ajouter une propriété quantité égale à celle du panier
              product.orderItem = {
                quantity: product.cartItem.quantity
              };
              return product;
            })
          );
        })
        .catch(err => console.log(err));
    })
    .then(result => {
      // Ici on vide le panier une fois que son contenu a été envoyé dans order (commande) grâce à une méthode fournie par sequelize
      return fetchedCart.setProducts(null);
    })
    .then(result => {
      console.log('Products added to Order');
      res.redirect('/orders');
    })
    .catch(err => console.log(err));
};
exports.getOrders = (req, res, next) => {
  req.user
    // Ici on dit à sequelize d'include les produits reliés aux orders (commandes)
    // Comme ca on récupère un tableau d'orders (commandes) qui inclus les produits pour chaque order
    .getOrders({ include: ['products'] })
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
