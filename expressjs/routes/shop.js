// On importe le core module path pour nous aider à avoir le path de la page html
// const path = require('path');

// const rootDir = require('../util/path');

const express = require('express');

const shopController = require('../controllers/shop');

const isAuth = require('../middleware/is-auth');

// const adminData = require('./admin');

const router = express.Router();

// ***** AVEC LE MVC PATTERN *****
router.get('/', shopController.getIndex);

router.get('/products', shopController.getProducts);

router.get('/products/:productId', shopController.getProduct);

// GET card
router.get('/cart', isAuth, shopController.getCart);
// POST card
router.post('/cart', isAuth, shopController.postCart);

router.post('/cart-delete-item', isAuth, shopController.postCartDeleteProduct);

router.post('/create-order', isAuth, shopController.postOrder);

router.get('/orders', isAuth, shopController.getOrders);

router.get('/orders/:orderId', isAuth, shopController.getInvoice);

// router.get('/checkout', shopController.getCheckout);

// ***** SANS LE MVC PATTERN *****
// *
// *
// *
// router.get('/', (req, res, next) => {
//   console.log('In another middleware!');
//   send() nous autorise à renvoyer une réponse (avec un body de type any)
//   //res.send("<h1>Hello from Express</h1>");
//   console.log(adminData.products);
//   __dirname = global variable de nodejs (contient le chemin absolu de notre projet)
// *
//   //res.sendFile(path.join(rootDir, 'views', 'shop.html'));
// *
//   On passe nos data products dans une variable pour l'injecter dans notre template ensuite
//   const products = adminData.products;
// *
//   Maintenant on va utiliser les templates engines (ici pug)
//   Pas besoin du path car on l'a déjà défini dans app.js => app.set('views', 'views')
//   Le second argument représente les data que l'on veut passer au template en tant qu'objet
//   On attache donc products à une clé que l'on a nommé prods ici
//   On peut mtn utiliser prods ou encore pageTitle dans notre template
//   NOTE : Avec handlebars template engines, on doit mettre la condition prods.length dans le Js qui va donc retourner true ou false
// *
//   res.render('shop', {
//     prods: products,
//     pageTitle: 'Shop',
//     path: '/',
//     hasProducts: products.length > 0,
//     activeShop: true,
//     productCSS: true
//   });
// });

module.exports = router;
