const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const userRouter = require('./routes/user');
const { checkAuthenticationCookie } = require('./middlewares/authentication');

const app = express();
const PORT = 3000;

mongoose.connect('mongodb://localhost:27017/blogify')
    .then(() => console.log('Connected to MongoDB'));

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkAuthenticationCookie('token'));

app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));


app.get('/', (req, res) => {
    res.render('home', {
        user: req.user 
    });
});

app.use("/user", userRouter);

app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));