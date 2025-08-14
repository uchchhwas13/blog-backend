import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import {
  renderCreateBlogPage,
  handleGetBlogDetails,
  handleAddBlogPost,
} from '../controllers/blog.controller';
import { handleAddComment } from '../controllers/comment.controller';

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
router.get('/add-new', renderCreateBlogPage);
router.post('/', upload.single('coverImage'), handleAddBlogPost);
router.get('/:id', handleGetBlogDetails);
router.post('/comment/:blogId', handleAddComment);

export default router;

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
