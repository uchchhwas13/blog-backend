require('dotenv').config();
import express from 'express';
import path from 'path';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import { renderHomePage } from './controllers/app';

import userRouter from './routes/user.route';
import blogRouter from './routes/blog.route';

import { checkAuthenticationCookie } from './middlewares/authentication';

const app = express();
const PORT = process.env.PORT;

if (!process.env.MONGO_URL) {
  console.error('MONGO_URL is not defined in .env file');
  process.exit(1);
}

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
