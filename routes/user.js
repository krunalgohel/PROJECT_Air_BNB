const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const passport = require('passport');
const { savedRedirectUrl } = require('../middleware.js');
const userController = require('../controllers/usre.js');

router
  .route('/signup')
  .get(userController.showSignupForm)
  .post(userController.signupUser);

router
  .route('/login')
  .get(userController.showLoginForm)
  .post(
    savedRedirectUrl,
    passport.authenticate('local', {
      failureRedirect: '/login',
      failureFlash: true,
    }),
    userController.loginUser
  );

router.route('/logout').get(userController.logoutUser);

module.exports = router;
