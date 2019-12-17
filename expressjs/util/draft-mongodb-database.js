require('dotenv').config();
const mongoURI = process.env.MONGODB_URI;
const mongodb = require('mongodb');
// MongoClient = MongoDB constructor
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = callback => {
  // On se connect à mongoDB (prend l'url de connect your application dans le cluster mongoDB que j'ai stocké danas le .env)
  // La connexion retourne une promesse
  MongoClient.connect(mongoURI)
    .then(client => {
      console.log('Connect to MongoDB !');
      // On enregistre la connexion dans la variable _db
      _db = client.db();
      callback();
    })
    .catch(err => {
      console.log(err);
      throw err;
    });
};

const getDb = () => {
  // On check si la connexion s'est bien enregistrée dans _db et on la retourne

  if (_db) {
    return _db;
  }
  throw 'No databse found!';
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
