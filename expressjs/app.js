// On importe express et on le stock dans une variable
const express = require("express");
// On importe le body parser
const bodyParser = require("body-parser");
// On créé une nouvelle app express() stockée dans la variable app
const app = express();

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

app.use("/add-product", (req, res, next) => {
  res.send(
    "<form action='/product' method='POST'><input type='text' name='title'><button type='submit'>Add Product </button></form>"
  );
});

app.use("/product", (req, res, next) => {
  console.log(req.body);
  res.send(`<h1> La réponse => ${req.body.title}</h1>`);
  //   res.redirect("/");
});

app.use("/", (req, res, next) => {
  console.log("In another middleware!");
  // send() nous autorise à renvoyer une réponse (avec un body de type any)
  res.send("<h1>Hello from Express</h1>");
});

// app.listen(port) nous permet à la fois d'appeler http.createServer() et y passer app en arg
// et également d'executer listen() sur le port souhaiter
app.listen(3000);
