import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import { Blog, IBlog } from '../models/blog';
import { Comment } from '../models/comment';
import { handleAddnewBlog } from '../controllers/addBlog.controller';
import { AuthRequest } from '../middlewares/authentication';

const router = Router();

const storage = multer.diskStorage({
  destination: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void,
  ) => {
    cb(null, path.resolve('./public/uploads/'));
  },
  filename: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void,
  ) => {
    const fileName = `${Date.now()}-${file.originalname}`;
    cb(null, fileName);
  },
});

const upload = multer({ storage });
router.get('/add-new', handleAddnewBlog);

// const storage = multer.diskStorage({
//   destination: function (req: Request, file, cb) {
//     cb(null, path.resolve(`./public/uploads/`));
//   },
//   filename: function (req, file, cb) {
//     const fileName = `${Date.now()}-${file.originalname}`;
//     cb(null, fileName);
//   },
// });

// const upload = multer({ storage: storage });

// router.get('/add-new', (req, res) => {
//   if (!req.user) {
//     return res.redirect('/user/signin');
//   }

//   return res.render('addBlog', {
//     user: req.user,
//   });
// });

// router.get('/add-new', (req: AuthRequest, res: Response) => {
//   if (!req.user) {
//     return res.redirect('/user/signin');
//   }

//   return res.render('addBlog', {
//     user: req.user,
//   });
// });

router.post(
  '/',
  upload.single('coverImage'),
  async (req: Request<{}, {}, IBlog>, res: Response) => {
    console.log('Request body for adding blog', req.body);
    console.log('Request user:', req.user);
    console.log('Uploaded file:', req.file);
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Cover image is required' });
    }

    const blog = await Blog.create({
      title: req.body.title,
      body: req.body.body,
      coverImageUrl: `/uploads/${req.file.filename}`,
      createdBy: req.user.id,
    });
    console.log('Blog created successfully', blog);
    return res.redirect(`/blog/${blog._id}`);
  },
);

router.get('/:id', async (req: Request, res: Response) => {
  const blog = await Blog.findById(req.params.id).populate('createdBy');
  const comments = await Comment.find({ blogId: req.params.id }).populate('createdBy');
  console.log('Blog details:', blog);
  console.log('Comments', comments);
  return res.render('blogDetails', {
    user: req.user,
    blog: blog,
    comments: comments,
  });
});

router.post('/comment/:blogId', async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  const comment = await Comment.create({
    content: req.body.content,
    createdBy: req.user.id,
    blogId: req.params.blogId,
  });
  console.log('Comment created:', comment);
  return res.redirect(`/blog/${req.params.blogId}`);
});

export default router;
