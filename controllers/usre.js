const User = require('../models/user');

module.exports.showSignupForm = (req, res) => {
  res.render('./user/signup.ejs');
};

module.exports.showLoginForm = (req, res) => {
  res.render('./user/login.ejs');
};

module.exports.loginUser = async (req, res) => {
  req.flash('success', 'welcome back to wondurlust!');
  let redirectUrl = res.locals.redirectUrl || '/listings';
  res.redirect(redirectUrl);
};

module.exports.logoutUser = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash('success', "You'r logged out successfully!");
    res.redirect('/listings');
  });
};

module.exports.signupUser = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    let user = new User({ email, username });
    let registerdUser = await User.register(user, password);
    console.log(registerdUser);
    req.login(registerdUser, (err) => {
      if (err) {
        next(err);
      }
      req.flash('success', 'User Register Successfull!');
      res.redirect('/listings');
    });
  } catch (err) {
    req.flash('error', err.message);
    res.redirect('/signup');
  }
};
