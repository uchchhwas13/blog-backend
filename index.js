const express = require('express');
const path = require('path');

const userRouter = require('./routes/user');

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));

app.get('/', (req, res) => {
    res.render('home');
});

app.use("/user", userRouter);

app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));