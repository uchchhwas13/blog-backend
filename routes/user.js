const { Router } = require('express');
const User = require('../models/user');

const router = Router();

router.get('/signin', (req, res) => {
  return res.render('signin');
});

router.get('/signup', (req, res) => {
  return res.render('signup');
});

router.post('/signin', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send('All fields are required');
  }
  try {
  const token = await User.matchPasswordAndGenerateToken(email, password);
  return res.cookie('token', token).redirect('/');
  } catch (error) {
    return res.render('signin', {
      error: "Incorrect email or password",
    });
  }
});

router.post('/signup', async (req, res) => {
  const { fullname, email, password } = req.body;
  console.log('Request body', req.body);
  if (!fullname || !email || !password) {
    return res.status(400).send('All fields are required');
  }

  await User.create({
    name: fullname,
    email: email,
    password: password,
  });
  return res.redirect('/');
});

module.exports = router;
