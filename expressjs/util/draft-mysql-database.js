/*
  *
  *
  * 
      CONNEXION BDD AVEC MYSQL / SEQUELIZE
  *
  *
  * 
*/

const Sequelize = require('sequelize');
require('dotenv').config();

// On instancie un nouveau constructor sequelize qui prend plusieurs options
// 1 : database name
// 2 : username
// 3 : password
// 4: un objet dans lequel on précise le language (ici mysql) et le host (il y a encore d'autres options qu'on pourrait préciser dans cet objet)
const sequelize = new Sequelize('node-complete', 'root', process.env.DB_PASS, {
  dialect: 'mysql',
  host: 'localhost'
});

module.exports = sequelize;

// ***** ANCIEN CODE CONNEXION SQL BDD SANS SEQUELIZE
// **
// **
// const mysql = require('mysql2');
// require('dotenv').config();

// // Icion créé une 'pool' de connexions qui va nous permettre de toujours avoir accès à la db
// // à chaque fois qu'on a une query afin d'avoir une connexion à chaque fois
// const pool = mysql.createPool({
//   host: 'localhost',
//   user: 'root',
//   database: 'node-complete',
//   password: process.env.DB_PASS
// });

// module.exports = pool.promise();
