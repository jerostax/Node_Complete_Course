const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const description = req.body.description;
  const price = req.body.price;
  // On istancie un nouveau produit (la class Product du modèle)
  const product = new Product(title, price, description, imageUrl);
  product
    // On utilise notre méthode save() du modèle qui enregistre dans la collection products
    .save()
    .then(result => {
      // console.log(result)
      console.log('Product Created');
      res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
};

// exports.getEditProduct = (req, res, next) => {
//   const editMode = req.query.edit;
//   if (!editMode) {
//     return res.redirect('/');
//   }
//   const prodId = req.params.productId;
//   // Ici on cherche les produits qui ont relié a l'user (retourne un tableau)
//   req.user
//     .getProducts({ where: { id: prodId } })
//     // Product.findByPk(prodId)
//     .then(products => {
//       const product = products[0];
//       if (!product) {
//         return res.redirect('/');
//       }
//       res.render('admin/edit-product', {
//         pageTitle: 'Edit Product',
//         path: '/admin/edit-product',
//         editing: editMode,
//         product
//       });
//     })
//     .catch(err => console.log(err));
// };

// exports.postEditProduct = (req, res, next) => {
//   const prodId = req.body.productId;
//   const updatedTitle = req.body.title;
//   const updatedPrice = req.body.price;
//   const updatedImageUrl = req.body.imageUrl;
//   const updatedDescription = req.body.description;
//   Product.findByPk(prodId)
//     .then(product => {
//       // On assigne les nouvelles valeurs (updated) de title, price, etc aux champs corrrespondant du model Product en bdd
//       product.title = updatedTitle;
//       product.price = updatedPrice;
//       product.description = updatedDescription;
//       product.imageUrl = updatedImageUrl;
//       // Ensuite on utilise la méthode save() de sequelize pour enregistrer et mettre à jour la bdd
//       return product.save();
//     })
//     // on return le produit une fois save et on chaine avec un then()
//     // Cela permet au catch() d'attraper les erreurs des 2 promesses (findByPk et save)
//     .then(result => {
//       console.log('Updated Product');
//       // Ici on dit de redirect uniquement quand la promesse est terminée
//       res.redirect('/admin/products');
//     })
//     .catch(err => console.log(err));
// };

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then(products => {
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products'
      });
    })
    .catch(err => {
      console.log(err);
    });
};

// exports.postDeleteProduct = (req, res, next) => {
//   const prodId = req.body.productId;
//   Product.findByPk(prodId)
//     // destroy() est une méthode de sequelize qui permet de supprimer un produit en bdd
//     .then(product => {
//       return product.destroy();
//     })
//     .then(result => {
//       console.log('Product deleted');
//       res.redirect('/admin/products');
//     })
//     .catch(err => console.log(err));
// };
