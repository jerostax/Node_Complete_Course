// On importe notre request Handler
const routes = require("./routes");
// On importe le "core module" http
const http = require("http");

// On créé notre server et on y passe notre request Handler
const server = http.createServer(routes);

// On écoute le server pour toutes les requetes qui arrivent
server.listen(3000);
