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
import { handleGetBlogLikes, handleBlogLikeStatus } from '../controllers/blogLike.controller';
import { blogLikeSchema } from '../validations/blogLikeSchema';

const blogRouter = Router();

blogRouter.post('/', upload.single('coverImage'), validateBlog, handleAddBlogPost);
blogRouter.get('/:id', handleGetBlogDetails);
blogRouter.post('/:blogId/comments', validateBody(commentSchema), handleAddComment);
blogRouter.get('/', handleGetBlogList);

blogRouter.post('/:blogId/likes', validateBody(blogLikeSchema), handleBlogLikeStatus);
blogRouter.get('/:blogId/likes', handleGetBlogLikes);

export default blogRouter;
