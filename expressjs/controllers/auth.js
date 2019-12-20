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
  req.session.isLoggedIn = true;
  res.redirect('/');
};
