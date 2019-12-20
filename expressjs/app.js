require('dotenv').config();
const MONGODB_URI = process.env.MONGODB_URI;
const path = require('path');
const express = require('express');
// On importe le body parser
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
// Ici on importe le package express pour créer des sessions
const session = require('express-session');
// On importe le package pour connecter une session à mongoDB et on y passe la session en 2eme fonction
const MongoDBStore = require('connect-mongodb-session')(session);

const errorController = require('./controllers/error');
// const mongoConnect = require('./util/database').mongoConnect;
const User = require('./models/user');

const app = express();
// Ici on initialise un nouveau store avec MongoDBStore comme constructor
// On y rajoute des options
// uri: on y passe notre URI de connection à mongoDB
// collection : on y spécifie dans quelle collection on veux store
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
});

app.set('view engine', 'ejs');

// on "set" une configuration globale pour les templates engines
// app.set('view engine', 'pug');
// Le deuxieme paramètre 'views" fait référence au nom du dossier ou sont nos templates HTML
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

// la fonction urlencoded va parse la réponse du body et passer à next()
app.use(bodyParser.urlencoded({ extended: false }));
// Middleware pour server des fichiers statics
app.use(express.static(path.join(__dirname, 'public')));
// Middleware qui déclenche la session
// resave : false => veux dire que la session ne sera pas enregistrée à chaque requete effectuée mais seulement si quelque chose change dans la session
// saveUninitialized : false => assure que la session ne sera pas enregistrée s'il y a une requête ou rien n'a changé dans la session
// store (store: store) on y précise quel est le store (notre const store) qu'on assigne au store de la session pour retrouver les datas qui viennent de la bdd
app.use(
  session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store
  })
);

// **** Ancien code pour créer un User avec mongoDB ****
// *
// Ici on cherche le user dans la bdd avec son id et on le stock ensuite dans l'objet request
// app.use((req, res, next) => {
//   User.findById('5df7995e660c771c1462377a')
//     .then(user => {
//       // On créé un nouveau User grâce au model auquel on passe chacune des propriétés spécifiées dans le constructor et qui existent déjà en bdd
//       req.user = new User(user.name, user.email, user.cart, user._id);
//       next();
//     })
//     .catch(err => console.log(err));
// });
// *

// **** Ancien code pour store un user dans obj request sans session ****
// *
// Ici je vais enregister mon User créé avec mongoose dans l'objet request
// app.use((req, res, next) => {
//   // findById() fourni par mongoose
//   User.findById('5df8be78a5f0a72e7c2e08c2')
//     .then(user => {
//       // J'enregistre le user avec l'id plus haut dans l'objet request
//       req.user = user;
//       next();
//     })
//     .catch(err => console.log(err));
// });
// *

// On use() adminRoutes
// On ajoute '/admin' comme filtre pour dire que seulement les url qui commencent avec /admin iront dans le fichier adminRoutes (admin.js)
app.use('/admin', adminRoutes);
// Pareil avec nos routes "shop"
app.use(shopRoutes);
app.use(authRoutes);

// 404 AVEC LE PATTERN MVC
app.use(errorController.get404Page);

// ***** Ancienne connexion sans mongoose ****
// *
// On execute la fonction mongoConnect dans lequel on lance notre app
// mongoConnect(() => {
//   app.listen(3000);
// });
// *

// Pour se connecter avec mongoose, on passe l'url fournie par mongoDb en argument de mongoose.connect()
// Puis dans le then() on lance notre app
mongoose
  .connect(MONGODB_URI)
  .then(result => {
    User.findOne().then(user => {
      if (!user) {
        // Si il n'y a pas d'user en bdd alors on créé un User avant de lancer l'app
        const user = new User({
          name: 'jerem',
          email: 'jeremy.geneste@gmail.com',
          cart: []
        });
        user.save();
      }
    });

    app.listen(3000);
  })
  .catch(err => {
    err;
  });
