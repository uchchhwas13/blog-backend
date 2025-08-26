import { Router } from 'express';
import {
  handleGetBlogDetails,
  handleAddBlogPost,
  handleGetBlogList,
} from '../controllers/blog.controller';
import { handleAddComment } from '../controllers/comment.controller';
import { validateBlog, validateBody } from '../middlewares/validateBlog.middleware';
import { commentSchema } from '../validations/commentSchema';
import { upload } from '../middlewares/multer.middleware';

const blogRouter = Router();

blogRouter.post('/', upload.single('coverImage'), validateBlog, handleAddBlogPost);
blogRouter.get('/:id', handleGetBlogDetails);
blogRouter.post('/comment/:blogId', validateBody(commentSchema), handleAddComment);
blogRouter.get('/', handleGetBlogList);

export default blogRouter;
