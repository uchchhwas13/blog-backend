import { Blog } from '../models/blog';
import { User } from '../models/user';
import { Request, Response } from 'express';

export const renderHomePage = async (req: Request, res: Response) => {
  const blogs = await Blog.find({});
  const user = req.user ? await User.findOne({ email: req.user.email }) : null;
  console.log('User info: ', user);
  res.render('home', {
    user: user,
    blogs: blogs,
  });
};
