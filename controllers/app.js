const Blog = require('../models/blog');
const User = require('../models/user');

async function renderHomePage(req, res) {
  const blogs = await Blog.find({});
  const user = req.user ? await User.findOne({ email: req.user.email }) : null;
  console.log('User info: ', user);
  res.render('home', {
    user: user,
    blogs: blogs,
  });
}

module.exports = {
  renderHomePage,
};
