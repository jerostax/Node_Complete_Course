const User = require('../models/user');

exports.getLogin = (req, res, next) => {
  // Ici on récupère la valeur true ou false de isLoggedIn dans le Cookie
  // const isLoggedIn = req.get('Cookie').split('=')[1];
  console.log(req.session.isLoggedIn);
  res.render('auth/login', {
    pageTitle: 'Login',
    path: '/login',
    isAuthenticated: false
  });
};

exports.postLogin = (req, res, next) => {
  // Ancien code pour set un cookie sans session
  // res.setHeader('Set-Cookie', 'loggedIn=true');
  User.findById('5df8be78a5f0a72e7c2e08c2')
    .then(user => {
      req.session.isLoggedIn = true;
      req.session.user = user;
      // Ici on save la session puis on redirect pour être sur que la session à été créée avant la redirection histoire de pas avoir de bugs d'affichage
      req.session.save(err => {
        console.log(err);
        res.redirect('/');
      });
    })
    .catch(err => console.log(err));
};

exports.postLogout = (req, res, next) => {
  // Ici on "détruit" la session pour se logout
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
};
