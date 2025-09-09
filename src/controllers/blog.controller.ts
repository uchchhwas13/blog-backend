import { Response, Request } from 'express';
import type { UserTokenPayload } from '../services/authentication';
import { getBlogDetails } from '../services/blog.service';
import {
  AddBlogPostPayload,
  BlogWithCommentsResponse,
  BlogPostResponse,
  BlogListAPIResponse,
} from '../types/blog.type';
import { ApiError } from '../utils/ApiError';
import { addBlogPost, getBlogList } from '../services/blog.service';

declare global {
  namespace Express {
    interface Request {
      user?: UserTokenPayload | null;
    }
  }
}

export const handleGetBlogList = async (req: Request, res: Response<BlogListAPIResponse>) => {
  try {
    const blogs = await getBlogList(req);
    return res.status(200).json({
      success: true,
      message: 'Blog list fetched successfully',
      data: {
        blogs,
      },
    });
  } catch (error) {
    throw new ApiError(500, 'Internal server error', error);
  }
};

export const handleAddBlogPost = async (
  req: Request<{}, {}, AddBlogPostPayload>,
  res: Response<BlogPostResponse>,
) => {
  if (!req.user) {
    throw new ApiError(401, 'Unauthorized');
  }

  if (!req.file) {
    throw new ApiError(400, 'File upload failed');
  }

  const data = await addBlogPost(req.body, req.user, req);
  return res.status(201).json({
    success: true,
    message: 'Blog post created successfully',
    data,
  });
};

export const handleGetBlogDetails = async (
  req: Request<{ id: string }>,
  res: Response<BlogWithCommentsResponse>,
) => {
  const data = await getBlogDetails(req, req.params.id, req.user?.id);

  return res.json({
    message: 'Blog details fetched successfully',
    success: true,
    data,
  });
};
