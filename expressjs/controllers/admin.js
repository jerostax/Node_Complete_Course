const Product = require('../models/product');

const { validationResult } = require('express-validator/check');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
    hasError: false,
    errorMessage: null,
    validationErrors: []
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const description = req.body.description;
  const price = req.body.price;
  const userId = req.user._id;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/edit-product',
      editing: false,
      hasError: true,
      product: { title, imageUrl, description, price },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array()
    });
  }
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
  const product = new Product({ title, price, description, imageUrl, userId });
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
  // findById() est fournie dans le cadre de mongoose, sinon c'est la méthode qu'on avait défini dans le modele avec mongodb
  Product.findById(prodId)
    .then(product => {
      if (!product) {
        return res.redirect('/');
      }
      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        hasError: false,
        product,
        errorMessage: null,
        validationErrors: []
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
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: true,
      hasError: true,
      product: {
        title: updatedTitle,
        imageUrl: updatedImageUrl,
        description: updatedDescription,
        price: updatedPrice,
        _id: prodId
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array()
    });
  }

  // **** Ancien code sans mongoose ****
  // *
  // Ici on créé un nouveau product avec les data à jour
  // const product = new Product(
  //   updatedTitle,
  //   updatedPrice,
  //   updatedDescription,
  //   updatedImageUrl,
  //   prodId
  // );
  // Ensuite on save() le product édité
  // *

  Product.findById(prodId)
    .then(product => {
      // Si le produit n'a pas le même userId que le user logged in alors on redirige
      if (product.userId.toString() != req.user._id.toString()) {
        return res.redirect('/');
      }
      // Ici on update les champs avec les nouvelles valeurs
      product.title = updatedTitle;
      product.price = updatedPrice;
      product.description = updatedDescription;
      product.imageUrl = updatedImageUrl;
      // Enfin on utilise la méthode save() de mongoose qui update notre product en bdd
      return product.save().then(result => {
        console.log('Updated Product');
        // Ici on dit de redirect uniquement quand la promesse est terminée
        res.redirect('/admin/products');
      });
    })
    .catch(err => console.log(err));
};

exports.getProducts = (req, res, next) => {
  // **** Ancien code sans mongoose ****
  // *
  // Product.fetchAll()
  // *

  // Ici on vérifi que le produit contienne le même userId que le user qui est connecté pour que seul l'user qui l'a créé puisse le voir et ensuite le modifier/delete
  Product.find({ userId: req.user._id })
    // populate() est une méthode de mongoose qui nous permet de dire qu'on avoir toutes les datas et pas seulement l'id (ici pour l'user)
    // Comme ça on a tout l'objet user avec son name et email
    // Une alternative existe avec select() qui permet de choisir quels champs précisement
    // ex: .select('title price -_id)   (-_id, le '-' signifie qu'on veux exclure l'id)
    // On peut passer en 2eme arg de populate les champs qu'on souhaite avoir
    // ex: opulate('userId', 'name')
    // .populate('userId') = nous permet d'avoir tous les champs du user
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
  // **** Ancien code sans mongoose ****
  // *
  // deleteById() est une méthode qu'on a définie dans notre modèle Product avec mongoDB
  // Product.deleteById(prodId)
  //*

  // findByIdAndRemove() est une méthode fournie par mongoose
  // Product.findByIdAndRemove(prodId)

  // On filtre avec l'id du produit et du user associé pour que ce ne soit que lui qui puisse delete
  Product.deleteOne({ _id: prodId, userId: req.user._id })
    .then(() => {
      console.log('Product deleted');
      res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
};
