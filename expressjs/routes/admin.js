const path = require('path');

const express = require('express');

const rootDir = require('../util/path');
// On utilise le Router d'express
const router = express.Router();

const products = [];

// /admon/add-product => GET
router.get('/add-product', (req, res, next) => {
  // res.sendFile(path.join(rootDir, 'views', 'add-product.html'));
  // Maintenant on render le pug template engines
  // On définit un path (peut être ce qu'on veut) pour pouvoir gérer du html dynamiquement en fonction du path (ex: class active)
  res.render('add-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    activeAddProduct: true,
    productCSS: true,
    formsCSS: true
  });
});
// get() ne se déclenche que lorsqu'on reçoit des requêtes get contrairement à use() qui se déclenche à chaque fois
// note: post() pour déclencher que les requêtes post
// NOTE : On peut donner la même routes à 2 middleware différents si les méthodes sont différentes (ici 1 fait get() et l'autre fait post())
// /admon/add-product => POST
router.post('/add-product', (req, res, next) => {
  console.log(req.body);
  products.push({ title: req.body.title });
  res.redirect('/');
});

exports.routes = router;
exports.products = products;
