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
router.post('/signup', check('email').isEmail(), authController.postSignup);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword);

module.exports = router;
