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
  // ***** Ancien Code Sans Mongoose ****
  // *
  // *
  // On istancie un nouveau produit (la class Product du modèle)
  // note: quand on récupère l'id du user via la l'objet request, il est automatiquement converti en string (pas besoin de convertir en ObjectId())
  // const product = new Product(
  //   title,
  //   price,
  //   description,
  //   imageUrl,
  //   null,
  //   req.user._id
  // );
  // *
  // *

  // Avec mongoose, on map les valeurs qu'on a défini dans notre schema
  // Le seul argument est donc cet objet javascript, ici j'utilise syntaxe ES6 mais en réalité le code =
  // title: title, price: price... (schema: dataRequest)
  const product = new Product({ title, price, description, imageUrl });
  product
    // MongoDB => On utilise notre méthode save() du modèle qui enregistre dans la collection products
    // Mongoose => la méthode save() est déjà définie par mongoose
    .save()
    .then(result => {
      // console.log(result)
      console.log('Product Created');
      res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  Product.findById(prodId)
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
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDescription = req.body.description;
  // Ici on créé un nouveau product avec les data à jour
  const product = new Product(
    updatedTitle,
    updatedPrice,
    updatedDescription,
    updatedImageUrl,
    prodId
  );
  // Ensuite on save() le product édité
  product
    .save()
    .then(result => {
      console.log('Updated Product');
      // Ici on dit de redirect uniquement quand la promesse est terminée
      res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
};

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

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.deleteById(prodId)
    .then(() => {
      console.log('Product deleted');
      res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
};
