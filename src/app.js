require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { renderHomePage } = require('./controllers/app');

const userRouter = require('./routes/user.route');
const blogRouter = require('./routes/blog');

const { checkAuthenticationCookie } = require('./middlewares/authentication');

const app = express();
const PORT = process.env.PORT;

mongoose.connect(process.env.MONGO_URL).then(() => console.log('Connected to MongoDB'));

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkAuthenticationCookie('token'));
app.use(express.static(path.resolve('./public')));

app.set('view engine', 'ejs');
app.set('views', path.resolve('./src/views'));

app.get('/', renderHomePage);

app.use('/user', userRouter);
app.use('/blog', blogRouter);

app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
