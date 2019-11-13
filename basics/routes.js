// On importe le "core module" file systeme
const fs = require("fs");

// Ici on code la fx requestListener en arrow fx de callback directement dans la méthode createServer
const requestHandler = (req, res) => {
  const url = req.url;
  const method = req.method;
  if (url === "/") {
    res.write("<html>");
    res.write("<head><title>Entrez un message</title></head>");
    res.write(
      '<body><form action="/message" method="POST"><input type="text" name="message" /><button type="submit">Send</button></form></body>'
    );
    res.write("</html>");
    return res.end();
  }
  if (url === "/message" && method === "POST") {
    const body = [];
    // on() est un event listener qui nous permet d'écouter certains évènements
    // Ici on veut écouter l'évènement data
    // cet évènement recoit un morceaux (chunk) de data avec lequel on veut intéragir
    req.on("data", chunk => {
      console.log(chunk);
      body.push(chunk);
    });
    return req.on("end", () => {
      // Ici on créé un nouveau Buffer (tanpon / "arrêt de bus pour stocker la data")
      // et ajouter un "morceau" (chunk) de data dedans
      // Ensuite on le converti en string
      const parsedBody = Buffer.concat(body).toString();
      console.log(parsedBody);
      const message = parsedBody.split("=")[1];
      fs.writeFile("message.txt", message, err => {
        //302 status code = redirection
        res.statusCode = 302;
        res.setHeader("Location", "/");
        return res.end();
      });
    });
  }
  res.setHeader("Content-Type", "text/html");
  res.write("<html>");
  res.write("<head><title>My first Node Page</title></head>");
  res.write("<body><h1>Hello from my Node Server</h1></body>");
  res.write("</html>");
  res.end();
};

// Maintenant on exporte le request Handler
module.exports = requestHandler;

// Autre syntaxe pour exporter
// module.exports = {
//     handler: requestHandler,
//     someText: 'some code'
// }
// Du coup dans app.js on utilisera routes.handler ou route.someText
