const path = require('path');
const express = require('express');
// On importe le body parser
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const mongoConnect = require('./util/database').mongoConnect;
const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');

// on "set" une configuration globale pour les templates engines
// app.set('view engine', 'pug');
// Le deuxieme paramètre 'views" fait référence au nom du dossier ou sont nos templates HTML
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

// la fonction urlencoded va parse la réponse du body et passer à next()
app.use(bodyParser.urlencoded({ extended: false }));
// Middleware pour server des fichiers statics
app.use(express.static(path.join(__dirname, 'public')));

// Ici on cherche le user dans la bdd avec son id et on le stock ensuite dans l'objet request
app.use((req, res, next) => {
  User.findById('5df7995e660c771c1462377a')
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

// On use() adminRoutes
// On ajoute '/admin' comme filtre pour dire que seulement les url qui commencent avec /admin iront dans le fichier adminRoutes (admin.js)
app.use('/admin', adminRoutes);
// Pareil avec nos routes "shop"
app.use(shopRoutes);

// 404 AVEC LE PATTERN MVC
app.use(errorController.get404Page);

// On execute la fonction mongoConnect dans lequel on lance notre app
mongoConnect(() => {
  app.listen(3000);
});
