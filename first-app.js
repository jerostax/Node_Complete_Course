console.log('Hello from Node.Js');

// fs = file system
// Imports some file system functionalities into this Js file
const fs = require('fs');

// Ici on peut utiliser writeFileSync() pour créer un nouveau fichier
// Prends le path ou l'on veut stocker ce fichier en 1er arg
// Le 2eme argument représente les datas qu'on veut mettre dedans
// Si on éxécute node first-app.js dans notre terminal, ça va créer un fichier hello.txt avec le texte qu'on a mis en 2eme arg dedans
fs.writeFileSync('hello.txt', 'Hello from Node.Js avec writeFileSync');
