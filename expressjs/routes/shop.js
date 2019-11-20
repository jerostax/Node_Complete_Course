// On importe le core module path pour nous aider à avoir le path de la page html
const path = require('path');

const rootDir = require('../util/path');

const express = require('express');

const adminData = require('./admin');

const router = express.Router();

router.get('/', (req, res, next) => {
  console.log('In another middleware!');
  // send() nous autorise à renvoyer une réponse (avec un body de type any)
  // res.send("<h1>Hello from Express</h1>");
  console.log(adminData.products);
  // __dirname = global variable de nodejs (contient le chemin absolu de notre projet)

  // res.sendFile(path.join(rootDir, 'views', 'shop.html'));

  // Maintenant on va utiliser les templates engines (ici pug)
  // Pas besoin du path car on l'a déjà défini dans app.js => app.set('views', 'views')
  res.render('shop');
});

module.exports = router;
