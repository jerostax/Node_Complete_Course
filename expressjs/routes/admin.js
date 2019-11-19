const path = require('path');

const express = require('express');

const rootDir = require('../util/path');
// On utilise le Router d'express
const router = express.Router();

// /admon/add-product => GET
router.get('/add-product', (req, res, next) => {
  res.sendFile(path.join(rootDir, 'views', 'add-product.html'));
});
// get() ne se déclenche que lorsqu'on reçoit des requêtes get contrairement à use() qui se déclenche à chaque fois
// note: post() pour déclencher que les requêtes post
// NOTE : On peut donner la même routes à 2 middleware différents si les méthodes sont différentes (ici 1 fait get() et l'autre fait post())
// /admon/add-product => POST
router.post('/add-product', (req, res, next) => {
  console.log(req.body);
  res.redirect('/');
});

module.exports = router;
