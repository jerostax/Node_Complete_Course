require('dotenv').config();
// crypto est une librairie node qui permet de créer une valeur aléatoire et securisé
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const { validationResult } = require('express-validator/check');

const User = require('../models/user');

const SENDGRID_KEY = process.env.SENDGRID_KEY;

// on passe la méthode sendgridTransport() à createTransport() de nodemailer
// cela nous permet de retourner une configuration qui permet d'utiliser sendgrid
const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: SENDGRID_KEY
    }
  })
);

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
    errorMessage: message,
    oldInput: { email: '', password: '' },
    validationErrors: []
    // **** Plus besoin de cette propriété avec locals variable ****
    // isAuthenticated: false
  });
};

exports.getSignup = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    errorMessage: message,
    oldInput: { email: '', password: '', confirmPassword: '' },
    validationErrors: []
    // **** Plus besoin de cette propriété avec locals variable ****
    // isAuthenticated: false
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const errors = validationResult(req);

  // Si on a une erreur
  if (!errors.isEmpty()) {
    return res.status(422).render('auth/login', {
      path: '/login',
      pageTitle: 'Login',
      errorMessage: errors.array()[0].msg,
      oldInput: { email, password },
      validationErrors: errors.array()
    });
  }

  // ES6 - filtre (email: email)
  User.findOne({ email })
    .then(user => {
      if (!user) {
        // // Ici on utilise la méthode flash() du package connect-flash qui nous permet de store de la data dans la session avant de redirect pour ensuite display un msg d'erreur
        // req.flash('error', 'Invalid email or password.');
        return res.status(422).render('auth/login', {
          path: '/login',
          pageTitle: 'Login',
          errorMessage: 'Invalid email or password.',
          oldInput: { email, password },
          validationErrors: []
        });
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
          // req.flash('error', 'Invalid email or password.');
          // res.redirect('/login');
          return res.status(422).render('auth/login', {
            path: '/login',
            pageTitle: 'Login',
            errorMessage: 'Invalid email or password.',
            oldInput: { email, password },
            validationErrors: []
          });
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
  // Ici on récupère les erreurs grâce au middleware check() passé dans la route postSignup
  const errors = validationResult(req);
  // Si on a une erreur
  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).render('auth/signup', {
      path: '/signup',
      pageTitle: 'Signup',
      errorMessage: errors.array()[0].msg,
      // ES6 => email: email, password: password... (on store les valeurs de req.body.email et password)
      oldInput: { email, password, confirmPassword },
      validationErrors: errors.array()
    });
  }

  // **** ANCIEN CODE POUR CHECK SI EMAIL EXISTE DEJA (ON CHECK DANS AUTH ROUTE MAINTENANT) ****
  // Ici on cherche en filtrant si un user à déjà le même email (en comparant le champs email en bdd avec notre const email de req.body.email)
  // ES5 => email: email
  // User.findOne({ email })
  //   .then(userDoc => {
  //     // Si userDoc existe, cela veux dire qu'on a un user qui a déjà cet email
  //     if (userDoc) {
  //       req.flash(
  //         'error',
  //         'Email exists already, please pick a different one.'
  //       );
  //       return res.redirect('/signup');
  //     }
  // *
  // *

  // Ici on hash le password
  // Le deuxieme argument précise combien de tour de hashing on veux pour le password (plus y en a plus c'est secure)
  bcrypt
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
      // Méthode du transporteur sendgrid pour envoyer un mail
      // to => email du nouveau use, from le mail que je veux, le sujet du mail puis le contenu dans html
      return transporter.sendMail({
        to: email,
        from: 'shop@node-complete.com',
        subject: 'Signup succeeded!',
        html: '<h1>You successfully signed up!</h1>'
      });
    })
    .catch(err => console.log(err))

    .catch(err => console.log(err));
};

exports.postLogout = (req, res, next) => {
  // Ici on "détruit" la session pour se logout
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
};

exports.getReset = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/reset', {
    path: '/reset',
    pageTitle: 'Reset Password',
    errorMessage: message
  });
};

exports.postReset = (req, res, next) => {
  // Ici on dit qu'on veut générer 32 bytes aléatoires
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect('/reset');
    }
    // Si y a pas d'erreur on peu générer un token depuis le buffer
    // On précise 'hex' pour spécifier que le buffer contient une valeur hexadécimal
    // toString() a besoin de savoir que c'est hexadecimal pour convertir en ASCII caracs
    const token = buffer.toString('hex');
    User.findOne({ email: req.body.email })
      .then(user => {
        if (!user) {
          req.flash('error', 'No account with that email found!');
          return res.redirect('/reset');
        }
        // Si l'email est retrouvé alors on créé le token et son expiration
        // 3600000 millisecondes = 1h
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        return user.save();
      })
      .then(result => {
        res.redirect('/');
        transporter.sendMail({
          to: req.body.email,
          from: 'shop@node-complete.com',
          subject: 'Password reset',
          // On passe le token dans l'url
          html: `
        <p>You requested a password reset</p>
        <p>Click this <a href='http://localhost:3000/reset/${token}'>link</a> to set a new password.</p>
        `
        });
      })
      .catch(err => console.log(err));
  });
};

exports.getNewPassword = (req, res, next) => {
  // On récupère le token depuis l'url (params)
  const token = req.params.token;

  // $gt est un opérateur qui veux dire greater than (ici on check que le resetTokenExpiration soit plus grand que la date actuelle)
  User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
    .then(user => {
      let message = req.flash('error');
      if (message.length > 0) {
        message = message[0];
      } else {
        message = null;
      }
      res.render('auth/new-password', {
        path: '/new-password',
        pageTitle: 'New Password',
        errorMessage: message,
        userId: user._id.toString(),
        passwordToken: token
      });
    })
    .catch(err => console.log(err));
};

exports.postNewPassword = (req, res, next) => {
  const newPassword = req.body.password;
  const userId = req.body.userId;
  const passwordToken = req.body.passwordToken;
  let resetUser;

  // Ici on cherche un user qui à le meme token, l'expiration plus haute que la date du moment et l'id égale
  User.findOne({
    resetToken: passwordToken,
    resetTokenExpiration: { $gt: Date.now() },
    _id: userId
  })
    .then(user => {
      // On stock le user trouvé dans la variable resetUser
      resetUser = user;
      // On retourne le nouveau password hashé
      return bcrypt.hash(newPassword, 12);
    })
    .then(hashedPassword => {
      // On assigne le nouveau password à la place de l'ancien
      resetUser.password = hashedPassword;
      // On assigne le reset token et son expiration à undifined (à ce stade plus besoin du token)
      resetUser.resetToken = undefined;
      resetUser.resetTokenExpiration = undefined;
      return resetUser.save();
    })
    .then(result => {
      res.redirect('/login');
    })
    .catch(err => console.log(err));
};
