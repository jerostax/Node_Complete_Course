// const path = require('path');

const express = require('express');

const { body } = require('express-validator/check');
// On importe notre products controller
const adminController = require('../controllers/admin');
// Ici on importe notre middleware qui va checher si le user est logged in
const isAuth = require('../middleware/is-auth');

// const rootDir = require('../util/path');
// On utilise le Router d'express
const router = express.Router();

// const products = [];

// ***** AVEC LE MVC PATTERN *****
// GET ROUTES

// On passe le middleware isAuth en premier pour checker si le user est logged in avant de render la route
// car les middlesware sont lus de gauche à droite
router.get('/add-product', isAuth, adminController.getAddProduct);

router.get('/products', isAuth, adminController.getProducts);

router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);

// POST ROUTES
router.post(
  '/add-product',
  [
    body('title')
      .isString()
      .isLength({ min: 3 })
      .trim(),
    // body('imageUrl').isURL(),
    body('price').isFloat(),
    body('description')
      .isLength({ min: 5, max: 400 })
      .trim()
  ],

  isAuth,
  adminController.postAddProduct
);

router.post(
  '/edit-product',
  [
    body('title')
      .isString()
      .isLength({ min: 3 })
      .trim(),
    // body('imageUrl').isURL(),
    body('price').isFloat(),
    body('description')
      .isLength({ min: 5, max: 400 })
      .trim()
  ],
  isAuth,
  adminController.postEditProduct
);

router.post('/delete-product', isAuth, adminController.postDeleteProduct);

// ***** SANS LE MVC PATTERN *****
// *
// *
// *
// /admin/add-product => GET
// *
// router.get('/add-product', (req, res, next) => {
//      On utilise plus sendFile car on va utiliser le template engines avec render()
//     //res.sendFile(path.join(rootDir, 'views', 'add-product.html'));
//     Maintenant on render le pug template engines
//     On définit un path (peut être ce qu'on veut) pour pouvoir gérer du html dynamiquement en fonction du path (ex: class active)
//     res.render('add-product', {
//        pageTitle: 'Add Product',
//        path: '/admin/add-product',
//        activeAddProduct: true,
//        productCSS: true,
//        formsCSS: true
//   });
// });

// *
// *

// get() ne se déclenche que lorsqu'on reçoit des requêtes get contrairement à use() qui se déclenche à chaque fois
// note: post() pour déclencher que les requêtes post
// NOTE : On peut donner la même routes à 2 middleware différents si les méthodes sont différentes (ici 1 fait get() et l'autre fait post())

// *
// *

// /admin/add-product => POST
// *
// router.post('/add-product', (req, res, next) => {
//   console.log(req.body);
//   products.push({ title: req.body.title });
//   res.redirect('/');
// });

// *
// *

// On a plus besoin de d'export product maintenant qu'on a installé le controller produit
// exports.routes = router;
// exports.products = products;

module.exports = router;
