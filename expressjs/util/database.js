const mysql = require('mysql2');
require('dotenv').config();

// Icion créé une 'pool' de connexions qui va nous permettre de toujours avoir accès à la db
// à chaque fois qu'on a une query afin d'avoir une connexion à chaque fois
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  database: 'node-complete',
  password: process.env.DB_PASS
});

module.exports = pool.promise();
