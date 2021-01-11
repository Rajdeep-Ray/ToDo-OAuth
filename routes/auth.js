const router = require('express').Router();
const authenticate = require('../authenticate');
const passport = require('passport');

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

// auth google
router.get('/google', passport.authenticate('google', { scope: ['profile','email'] }));

// callback route for google to redirect to hand control to passport
router.get('/google/redirect', passport.authenticate('google'), (req, res) => {
  console.log(req.user);
  const token = authenticate.getToken({ _id: req.user._id })
  res.json({ token: token });
});

module.exports = router;