const express = require('express');
// On importe le sous package check du package express-validator
const { check, body } = require('express-validator/check');

const authController = require('../controllers/auth');
const User = require('../models/user');

const router = express.Router();

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.post(
  '/login',
  [
    check('email', 'Please enter a valid email.')
      .isEmail()
      .normalizeEmail(),
    body(
      'password',
      'Please enter a password with only number and text and at least 5 characters'
    )
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim()
  ],
  authController.postLogin
);

router.post('/logout', authController.postLogout);

// On ajoute un middleware pour check/validation
router.post(
  '/signup',
  [
    check('email')
      // isEmail validator check si c'est bien une adresse email
      .isEmail()
      .withMessage('Please enter a valid email.')
      .normalizeEmail()
      // CUSTOM VALIDATOR
      // .custom((value, { req }) => {
      //   if (value === 'test@test.com') {
      //     throw new Error('This email address is forbidden.');
      //   } else {
      //     return true;
      //   }
      // }),

      // Ici on retourne une promesse, si elle se résolue sans erreur alors la validation marche
      // Si elle se résolue avec un "rejet" alors elle passe reject() comme une new Error()
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then(userDoc => {
          if (userDoc) {
            return Promise.reject(
              'Email already exists, please pick a different one.'
            );
          }
        });
      }),
    // Alternative à check(), ici on va check le password via le body
    // On peut passer le msg d'erreur en 2eme argument (marche avec check() également)
    body(
      'password',
      'Please enter a password with only number and text and at least 5 characters'
    )
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim(),
    body('confirmPassword')
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Passwords have to match!');
        } else {
          return true;
        }
      })
  ],

  authController.postSignup
);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword);

module.exports = router;
