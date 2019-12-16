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
  // findByPk() est une méthode de sequelize qui permet de faire un findById()
  Product.findByPk(prodId)
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
  // getCart() est une méthode qui a été créé par sequelize après avoir défini nos modèles et relations
  req.user
    .getCart()
    .then(cart => {
      // console.log(cart);
      // On peut maintenant fetch les produits à l'interieur du panier (cart) et les retourner
      return cart
        .getProducts()
        .then(products => {
          res.render('shop/cart', {
            pageTitle: 'Your Cart',
            path: '/cart',
            // ES6 SYNTAXE
            products
          });
        })
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  // Ici on créé une variable pour stocker le panier et y avoir accès dans toutes les fonctions anonymes, notemment pour ajouter un nouveau produit dedans
  let fetchedCart;
  // On créé une variable pour la quantité du produit qui est de 1 au départ et accessible dans nos fonctions anonymes
  let newQuantity = 1;
  req.user
    .getCart()
    .then(cart => {
      // On assigne donc le panier à la variable créée plus haut
      fetchedCart = cart;
      // Ici on récupère les produits déjà dans le panier grâce à l'id (ce qui va nous permettre d'incrémenter la quantité dans ce cas)
      return cart.getProducts({
        where: { id: prodId }
      });
    })
    .then(products => {
      let product;
      // Ici on vérifi qu'on a au moins un produit
      if (products.length > 0) {
        // Si on a bien au moins un produit, alors on assigne le premier à la variable product
        product = products[0];
      }

      // Si on a bien un produit ça veut dire qu'on va incrémenter sa quantité donc
      if (product) {
        // Ici on va donc récupérer l'ancienne quantité et l'incrémenter pour ce produit déjà existant dans le panier
        // D'abord on accède à l'ancienne quantité
        const oldQuantity = product.cartItem.quantity;
        // On incrémente donc
        newQuantity = oldQuantity + 1;
        // On return le product pour passer au prochain then() et update sa quantité
        return product;
      }
      // Si on a aucun produit dans le panier qui correspond à l'id (le produit n'existe donc pas encore dans le panier)
      // on va donc le trouver pour pouvoir ensuite l'ajouter dans le panier
      return Product.findByPk(prodId);
    })
    .then(product => {
      // Enfin, on va donc rajouter le nouveau produit ou incrémenter celui déjà existant dans le panier
      // addProduct() est une méthode créée par sequelize après avoir défini nos modèles et relations (manyToMany)
      // Avec through nous permet de dire à sequelize qu'il y a des informations supplémentaires ou il faut set la valeur
      // (ici quantity qui va être égale à la variable newQuantity qui est égale à 1 étant donné qu'on ajoute ce produit pour la premiere fois dans le panier)
      // On a plus qu'a rajouter le produit avec sa nouvelle quantité (1 s'il est nouveau dans le panier et alors incrémenté s'il existe déjà)
      return fetchedCart.addProduct(product, {
        through: {
          quantity: newQuantity
        }
      });
    })
    .then(() => {
      res.redirect('/cart');
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
