const http = require("http");
// On importe express et on le stock dans une variable
const express = require("express");
// On créé une nouvelle app express() stockée dans la variable app
const app = express();

// use() nous autorise à ajouter une nouvelle fx middleware
// La fx qu'on passe a use() sera excecutée à chaque requête entrante
// elle a 3 args => request object, response object, next
// next est une function qui doit s'éxécuter pour autoriser une requête à aller au prochain middleware

app.use((req, res, next) => {
    console.log('In the middleware!')
    next(); // autorise la requête à passer dans le prochain middleware
});
app.use((req, res, next) => {
    console.log('In another middleware!')
    // send() nous autorise à renvoyer une réponse (avec un body de type any)
    res.send('<h1>Hello from Express</h1>');
});

// On se sert de notre app express comme request handler valide qu'on passe à createServer
const server = http.createServer(app);

server.listen(3000);
