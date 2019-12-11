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
  // La méthode create() nous est fournie par sequelize
  Product.create({
    // Attention, ici j'utilise la syntaxe ES6, title === title : title, etc
    title,
    price,
    imageUrl,
    description
  })
    .then(result => {
      // console.log(result)
      console.log('Product Created');
      res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
  // ***** ANCIEN CODE SANS SEQUELIZE *****
  // **
  // **
  // const product = new Product(null, title, imageUrl, description, price);
  // product
  //   .save()
  //   .then(() => {
  //     res.redirect('/');
  //   })
  //   .catch(err => console.log(err));
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  Product.findByPk(prodId)
    .then(product => {
      if (!product) {
        return res.redirect('/');
      }
      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product
      });
    })
    .catch(err => console.log(err));
  // **** ANCIEN CODE AVEC DATA SOTCK DANS JSON ****
  // **
  // **
  // Product.findById(prodId, product => {
  //   if (!product) {
  //     return res.redirect('/');
  //   }
  //   res.render('admin/edit-product', {
  //     pageTitle: 'Edit Product',
  //     path: '/admin/edit-product',
  //     editing: editMode,
  //     product
  //   });
  // });
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDescription = req.body.description;
  Product.findByPk(prodId)
    .then(product => {
      // On assigne les nouvelles valeurs (updated) de title, price, etc aux champs corrrespondant du model Product en bdd
      product.title = updatedTitle;
      product.price = updatedPrice;
      product.description = updatedDescription;
      product.imageUrl = updatedImageUrl;
      // Ensuite on utilise la méthode save() de sequelize pour enregistrer et mettre à jour la bdd
      return product.save();
    })
    // on return le produit une fois save et on chaine avec un then()
    // Cela permet au catch() d'attraper les erreurs des 2 promesses (findByPk et save)
    .then(result => {
      console.log('Updated Product');
      // Ici on dit de redirect uniquement quand la promesse est terminée
      res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
  // **** ANCIEN CODE AVEC DATA SOTCK DANS JSON ****
  // **
  // **
  // const updatedProduct = new Product(
  //   prodId,
  //   updatedTitle,
  //   updatedImageUrl,
  //   updatedDescription,
  //   updatedPrice
  // );
  // updatedProduct.save();
  // res.redirect('/admin/products');
};

exports.getProducts = (req, res, next) => {
  Product.findAll()
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

  // **** ANCIEN CODE AVEC DATA SOTCK DANS JSON ****
  // **
  // **
  // Product.fetchAll(products => {
  //   res.render('admin/products', {
  //     prods: products,
  //     pageTitle: 'Admin Products',
  //     path: '/admin/products'
  //   });
  // });
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findByPk(prodId)
    // destroy() est une méthode de sequelize qui permet de supprimer un produit en bdd
    .then(product => {
      return product.destroy();
    })
    .then(result => {
      console.log('Product deleted');
      res.redirect('/admin/products');
    })
    .catch(err => console.log(err));

  // **** ANCIEN CODE AVEC DATA SOTCK DANS JSON ****
  // **
  // **
  // Product.deleteById(prodId);
  // res.redirect(
  //   '/admin/products'
  // );
};
