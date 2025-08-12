const User = require('../models/user');

async function handleSignup(req, res) {
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
}

module.exports = {
  handleSignup,
};
