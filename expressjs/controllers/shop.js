// Dans ce controller on passe la logique pour les produits et on export la fonction
// pour l'utiliser dans notre route admin

// On importe le model Product
const Product = require('../models/product');
// On importe le model Cart
const Cart = require('../models/cart');

exports.getProducts = (req, res, next) => {
  // Ici on utilise la méthode findAll() de sequelize
  Product.findAll()
    .then(products => {
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All Products',
        path: '/products'
      });
    })
    .catch(err => console.log(err));

  // **** ANCIEN CODE SANS SEQUELIZE ****
  // **
  // **
  // // On passe notre code en callback de la fonction fetchAll à cause du comportement asynchrone de la méthode fetchAll dans le model Product
  // Product.fetchAll()
  //   .then(([rows, fieldData]) => {
  //     res.render('shop/product-list', {
  //       prods: rows,
  //       pageTitle: 'All Products',
  //       path: '/products'
  //     });
  //   })
  //   .catch(err => {
  //     console.log(err);
  //   });

  // **** ANCIEN CODE AVEC LES PRODUITS STOCK DANS LES FICHIERS JSON ****
  // **
  // **
  // Product.fetchAll(products => {
  //   res.render('shop/product-list', {
  //     prods: products,
  //     pageTitle: 'All Products',
  //     path: '/products'
  //     // Le code ci-dessous servait pour le template engine handlebars qui ne gère pas le js dans le template
  //     // hasProducts: products.length > 0,
  //     // activeShop: true,
  //     // productCSS: true
  //   });
  // });
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

  // **** ANCIEN CODE SANS SEQUELIZE ****
  // **
  // **
  // Product.findById(prodId)
  //   .then(([product]) => {
  //     res.render('shop/product-detail', {
  //       product: product[0],
  //       pageTitle: product[0].title,
  //       path: '/products'
  //     });
  //   })
  //   .catch(err => console.log(err));

  // **** ANCIEN CODE AVEC LES PRODUITS STOCK DANS LES FICHIERS JSON ****
  // **
  // **
  // console.log(
  //   Product.findById(prodId, product => {
  //     console.log(product);
  //     res.render('shop/product-detail', {
  //       product,
  //       pageTitle: product.title,
  //       path: '/products'
  //     });
  //   })
  // );
};

exports.getIndex = (req, res, next) => {
  // Ici on utilise la méthode findAll() de sequelize
  Product.findAll()
    .then(products => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/'
      });
    })
    .catch(err => console.log(err));

  // **** ANCIEN CODE SANS SEQUELIZE ****
  // **
  // **
  // fetchAll() retourne mtn une promesse
  // Product.fetchAll()
  //   // rows retourne les produits, fieldData retourne les caracs de la table
  //   .then(([rows, fieldData]) => {
  //     console.log('rows =>', rows);
  //     console.log('fieldData =>', fieldData);
  //     res.render('shop/index', {
  //       prods: rows,
  //       pageTitle: 'Shop',
  //       path: '/'
  //     });
  //   })
  //   .catch(err => console.log(err));

  // **** ANCIEN CODE AVEC LES PRODUITS STOCK DANS LES FICHIERS JSON ****
  // **
  // **
  // Product.fetchAll(products => {
  //   res.render('shop/index', {
  //     prods: products,
  //     pageTitle: 'Shop',
  //     path: '/'
  //   });
  // });
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

  // **** ANCIEN CODE AVANT SEQUELIZE ****
  // **
  // **
  // On récupère le panier
  // Cart.getCart(cart => {
  //   // On fetch tous les produits
  //   Product.fetchAll(products => {
  //     // On instancie un array dans lequel on pushera nos produits qui font parti du panier
  //     const cartProducts = [];
  //     // On boucle sur tous nos produits
  //     for (product of products) {
  //       // On vérifi si chaque produit est dans le panier ou pas
  //       //(si le produit du panier à le même id que le produit sur lequel on est en train de boucler...)
  //       const cartProductData = cart.products.find(
  //         prod => prod.id === product.id
  //       );
  //       if (cartProductData) {
  //         // Alors on push le produit et la quantité dans notre array cartProduct
  //         cartProducts.push({ productData: product, qty: cartProductData.qty });
  //       }
  //     }
  //     res.render('shop/cart', {
  //       pageTitle: 'Your Cart',
  //       path: '/cart',
  //       products: cartProducts
  //     });
  //   });
  // });
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

  // **** ANCIEN CODE AVANT SEQUELIZE ****
  // **
  // **
  // const prodId = req.body.productId;
  // Product.findById(prodId, product => {
  //   Cart.addProduct(prodId, product.price);
  // });
  // res.redirect('/cart');
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
  // **** ANCIEN CODE AVANT SEQUELIZE ****
  // **
  // **
  // Ici on va chercher le produit grâce à son id
  // Product.findById(
  //   prodId,
  //   product => {
  //     // Maintenant on peut appliquer la méthode delete en y passant l'id et le prix en arg
  //     Cart.deleteProduct(
  //       prodId,
  //       product.price
  //     );
  //     res.redirect('/cart');
  //   }
  // );
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
