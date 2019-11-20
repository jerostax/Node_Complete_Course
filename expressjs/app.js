const path = require('path');
// On importe express et on le stock dans une variable
const express = require('express');
// On importe le body parser
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');

// On importe le template engines handlebars
// const expressHbs = require('express-handlebars');

// On créé une nouvelle app express() stockée dans la variable app
const app = express();

// Ici on initilise le template engines handlebars
// note: on passe en option le layouts directory et le layout par défaut ainsi que l'extension .hbs
// app.engine(
//   'hbs',
//   expressHbs({
//     layoutsDir: 'views/layouts/',
//     defaultLayout: 'main-layout',
//     extname: 'hbs'
//   })
// );
// app.set('view engine', 'hbs');

app.set('view engine', 'ejs');

// on "set" une configuration globale pour les templates engines
// app.set('view engine', 'pug');
// Le deuxieme paramètre 'views" fait référence au nom du dossier ou sont nos templates HTML
app.set('views', 'views');

// On importe l'objet Router du fichier admin.js qui contient nos routes "admin"
const adminRoutes = require('./routes/admin');
// On importe l'objet Router du fichier shop.js qui contient nos routes "shop"
const shopRoutes = require('./routes/shop');

// use() nous autorise à ajouter une nouvelle fx middleware
// La fx qu'on passe a use() sera excecutée à chaque requête entrante
// elle a 3 args => request object, response object, next
// next est une function qui doit s'éxécuter pour autoriser une requête à aller au prochain middleware

/*
app.use((req, res, next) => {
  console.log("In the middleware!");
  next(); // autorise la requête à passer dans le prochain middleware
});
*/

// la fonction urlencoded va parse la réponse du body et passer à next()
app.use(bodyParser.urlencoded({ extended: false }));
// Middleware pour server des fichiers statics
app.use(express.static(path.join(__dirname, 'public')));
// On use() adminRoutes
// On ajoute '/admin' comme filtre pour dire que seulement les url qui commencent avec /admin iront dans le fichier adminRoutes (admin.js)
app.use('/admin', adminRoutes);
// Pareil avec nos routes "shop"
app.use(shopRoutes);

// 404 AVEC LE PATTERN MVC
app.use(errorController.get404Page);
// Ce dernier middleware va déclanger une erreur 404 car il sera executé uniquement si on a pas trouvé les routes des middlewares précedents
// SANS LE PATTERN MVC
// app.use((req, res, next) => {
//   // res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
//   res.status(404).render('404', { pageTitle: 'Page Not Found' });
// });

// app.listen(port) nous permet à la fois d'appeler http.createServer() et y passer app en arg
// et également d'executer listen() sur le port souhaiter
app.listen(3000);
