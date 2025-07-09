const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

const userRouter = require('./routes/user');

const app = express();
const PORT = 3000;

mongoose.connect('mongodb://localhost:27017/blogify')
    .then(() => console.log('Connected to MongoDB'));

app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));

app.use(express.urlencoded({ extended: false }));
app.get('/', (req, res) => {
    res.render('home');
});

app.use("/user", userRouter);

app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));