const {Router} = require('express');
const User = require('../models/user');

const router = Router();

router.get('/', (req, res) => {
  return res.render('home');
});

router.get('/signin', (req, res) => {
  return res.render('signin');
});

router.get('/signup', (req, res) => {
  return res.render('signup');
});

router.post('/signup', async (req, res) => {
  const {fullName, email, password} = req.body;
  await User.create({
    name: fullName,
    email,
    password,
  });
  return res.redirect('/');
});

module.exports = router;