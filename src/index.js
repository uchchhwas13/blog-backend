//This file contains the same code as the app.js. I will drop this file later.

// const express = require('express');
// const path = require('path');
// const mongoose = require('mongoose');
// const cookieParser = require('cookie-parser');
// const Blog = require('./models/blog');
// const User = require('./models/user');

// const userRouter = require('./routes/user.route');
// const blogRouter = require('./routes/blog');

// const { checkAuthenticationCookie } = require('./middlewares/authentication');

// const app = express();
// const PORT = 3000;

// mongoose
//   .connect('mongodb://localhost:27017/blogify')
//   .then(() => console.log('Connected to MongoDB'));

// app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(checkAuthenticationCookie('token'));
// app.use(express.static(path.resolve('./public')));

// app.set('view engine', 'ejs');
// app.set('views', path.resolve('./views'));

// app.get('/', async (req, res) => {
//   const blogs = await Blog.find({});
//   let userInfo;
//   if (req.user) {
//     userInfo = await User.findOne({ email: req.user.email });
//   } else {
//     userInfo = null;
//   }
//   console.log('User info: ', userInfo);
//   res.render('home', {
//     user: userInfo,
//     blogs: blogs,
//   });
// });

// app.use('/user', userRouter);
// app.use('/blog', blogRouter);

// app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
