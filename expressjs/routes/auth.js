const express = require('express');
// On importe le sous package check du package express-validator
const { check } = require('express-validator/check');

const authController = require('../controllers/auth');
const router = express.Router();

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.post('/login', authController.postLogin);

router.post('/logout', authController.postLogout);

// On ajoute un middleware pour check/validation
router.post(
  '/signup',
  check('email')
    // isEmail validator check si c'est bien une adresse email
    .isEmail()
    .withMessage('Please enter a valid email.')
    // CUSTOM VALIDATOR 
    // .custom((value, { req }) => {
    //   if (value === 'test@test.com') {
    //     throw new Error('This email address is forbidden.');
    //   } else {
    //     return true;
    //   }
    // }),
  authController.postSignup
);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword);

module.exports = router;
