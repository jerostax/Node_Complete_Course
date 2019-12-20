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
      console.log(req.session);
      res.redirect('/');
    })
    .catch(err => console.log(err));
};
