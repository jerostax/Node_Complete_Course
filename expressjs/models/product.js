// On importe sequelize
const Sequelize = require('sequelize');
// On importe la connexion à la db (pool de connexion)
const sequelize = require('../util/database');

// On défini notre modèle Product grâce à la méthode define() de sequelize
// Le premier arg défini le nom de notre modèle
// Le second arg défini la structure
const Product = sequelize.define('product', {
  // Ici on défini donc la structure de notre table avec le type des champs notamment (ici également l'auto-incrémentation, l'impossibilité d'avoir le champs null et dire que c'est la clé primaire)
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false
  },
  price: {
    type: Sequelize.DOUBLE,
    allowNull: false
  },
  imageUrl: {
    type: Sequelize.STRING,
    allowNull: false
  },
  description: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

// Enfin on exporte le modèle Product
module.exports = Product;
