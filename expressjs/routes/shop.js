// On importe le core module path pour nous aider à avoir le path de la page html
const path = require('path');

const express = require('express');

const router = express.Router();

router.get('/', (req, res, next) => {
  console.log('In another middleware!');
  // send() nous autorise à renvoyer une réponse (avec un body de type any)
  // res.send("<h1>Hello from Express</h1>");

  // __dirname = global variable de nodejs (contient le chemin absolu de notre projet)
  res.sendFile(path.join(__dirname, '../', 'views', 'shop.html'));
});

module.exports = router;