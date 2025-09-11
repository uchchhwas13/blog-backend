require('dotenv').config();
import express from 'express';
import path from 'path';
import mongoose from 'mongoose';
import cors from 'cors';

import userRouter from './routes/user.route';
import blogRouter from './routes/blog.route';

import { authenticateRequest } from './middlewares/authentication.middleware';
import { errorHandler } from './middlewares/errorHandler';
import { contentNegotiation } from './middlewares/contentNegotiation.middleware';

const app = express();
const PORT = process.env.PORT;

if (!process.env.MONGO_URL) {
  console.error('MONGO_URL is not defined in .env file');
  process.exit(1);
}

mongoose.connect(process.env.MONGO_URL).then(() => console.log('Connected to MongoDB'));

app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: 'http://localhost:5173',
  }),
);

app.use(express.json());
app.use(contentNegotiation);
app.use(authenticateRequest('accessToken'));
app.use(express.static(path.resolve('./public')));

app.use('/user', userRouter);
app.use('/blogs', blogRouter);

app.use(errorHandler);

// Serve static files from the "uploads" folder
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
