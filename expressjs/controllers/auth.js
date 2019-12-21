const bcrypt = require('bcryptjs');

const User = require('../models/user');

exports.getLogin = (req, res, next) => {
  // Ici on récupère la valeur true ou false de isLoggedIn dans le Cookie
  // const isLoggedIn = req.get('Cookie').split('=')[1];
  // console.log(req.session.isLoggedIn);

  // Ici on store le message d'erreur dans une variable
  let message = req.flash('error');
  // Ensuite on check s'il y en a un ou pas
  if (message.length > 0) {
    // Si il y en a un on le store dans la variable message
    message = message[0];
  } else {
    // Sinon il est égal à null pour ne pas render le style sur la page notemment
    message = null;
  }
  res.render('auth/login', {
    pageTitle: 'Login',
    path: '/login',
    // Ici on passe la clé du message qu'on veux display s'il y a eu une erreur
    errorMessage: message
    // **** Plus besoin de cette propriété avec locals variable ****
    // isAuthenticated: false
  });
};

exports.getSignup = (req, res, next) => {
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup'
    // **** Plus besoin de cette propriété avec locals variable ****
    // isAuthenticated: false
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  // ES6 - filtre (email: email)
  User.findOne({ email })
    .then(user => {
      if (!user) {
        // Ici on utilise la méthode flash() du package connect-flash qui nous permet de store de la data dans la session avant de redirect pour ensuite display un msg d'erreur
        req.flash('error', 'Invalid email or password.');
        return res.redirect('/login');
      }
      // On passe le password de la request à bcrypt qui est capable de le comparer au password hashé
      // Le résult est true ou false
      bcrypt
        .compare(password, user.password)
        .then(doMatch => {
          // Si doMatch est true, cela veux dire que les password sont les mêmes
          if (doMatch) {
            // On setup donc la session
            req.session.isLoggedIn = true;
            req.session.user = user;
            // Plus qu'à save la session et redirect sur la homepage
            return req.session.save(err => {
              console.log(err);
              res.redirect('/');
            });
          }
          res.redirect('/login');
        })
        .catch(err => {
          console.log(err);
          res.redirect('/login');
        });
    })

    // Ancien code pour set un cookie sans session
    // res.setHeader('Set-Cookie', 'loggedIn=true');

    // **** Ancien code pour login user créé à la main sans authentification flow ****
    // *
    // User.findById('5df8be78a5f0a72e7c2e08c2')
    //   .then(user => {
    //     req.session.isLoggedIn = true;
    //     req.session.user = user;
    //     // Ici on save la session puis on redirect pour être sur que la session à été créée avant la redirection histoire de pas avoir de bugs d'affichage
    //     req.session.save(err => {
    //       console.log(err);
    //       res.redirect('/');
    //     });
    //   })
    // *

    .catch(err => console.log(err));
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  // Ici on cherche en filtrant si un user à déjà le même email (en comparant le champs email en bdd avec notre const email de req.body.email)
  // ES5 => email: email
  User.findOne({ email })
    .then(userDoc => {
      // Si userDoc existe, cela veux dire qu'on a un user qui a déjà cet email
      if (userDoc) {
        return res.redirect('/signup');
      }
      // Ici on hash le password
      // Le deuxieme argument précise combien de tour de hashing on veux pour le password (plus y en a plus c'est secure)
      return bcrypt
        .hash(password, 12)
        .then(hashedPassword => {
          // Ici encore j'utilise ES6 (email: email)
          const user = new User({
            email,
            password: hashedPassword,
            cart: { items: [] }
          });
          return user.save();
        })
        .then(result => {
          res.redirect('/login');
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
