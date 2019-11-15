// On importe express et on le stock dans une variable
const express = require("express");
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
app.use("/users", (req, res, next) => {
  res.send("<h1>User's page</h1>");
});

app.use("/", (req, res, next) => {
  console.log("In another middleware!");
  // send() nous autorise à renvoyer une réponse (avec un body de type any)
  res.send("<h1>Hello from Express</h1>");
});

// app.listen(port) nous permet à la fois d'appeler http.createServer() et y passer app en arg
// et également d'executer listen() sur le port souhaiter
app.listen(3000);
