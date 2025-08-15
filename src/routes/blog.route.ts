import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import {
  renderCreateBlogPage,
  handleGetBlogDetails,
  handleAddBlogPost,
} from '../controllers/blog.controller';
import { handleAddComment } from '../controllers/comment.controller';
import { validateBlog } from '../middlewares/validateBlog.middleware';
import { authenticateRequest } from '../middlewares/authentication.middleware';

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
router.post('/', upload.single('coverImage'), validateBlog, handleAddBlogPost);
router.get('/:id', handleGetBlogDetails);
router.post('/comment/:blogId', handleAddComment);

export default router;
