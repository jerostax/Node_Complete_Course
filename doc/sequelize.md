## What is Sequelize?

Sequelize est une Object-Relational Mapping Library.
<br>
Basiquement, sequelize fait les requêtes sql à notre place et les map (parcours) dans des objets Javascript avec des méthodes qu'on peut appeler. On a donc plus besoin d'écrire nous même du sql.
<br>
ex:

- On a un table User
- Sequelize map la table user et créé un objet javascript avec les champs (il setup aussi les relations pour nous)
- Si on créé un nouveau user, on va appeler une méthode sur l'objet user javascript et sequelize va exevuter la bonne requête sql.
  <br>
  Sequelize nous fournis les models (ex: User, Product...) et nous permet de les définir (quelle data représente le model).
  On peut instancier ces models (classe) et executer les fonctions constructor ou les méthodes de sequelize pour par exemple créer un nouveau user basé sur ce model et ensuite faire des requêtes dessus.
  Enfin, on peut également associé nos models (relations comme hasMany...).
