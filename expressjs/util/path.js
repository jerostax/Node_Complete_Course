const path = require('path');

// On utilise la variable global process pour spécifier qu'on veut passer le path au 'main module' de l'app,
// En gros la racine du projet 
module.exports = path.dirname(process.mainModule.filename);
