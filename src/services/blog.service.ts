// services/blog.service.ts
import { Blog } from '../models/blog';
import { Request } from 'express';
import { buildFileUrl } from '../utils/fileUrlGenerator';
import { AddBlogPostPayload, BlogCreationResponse, BlogItem } from '../types/blog.type';
import { UserTokenPayload } from './authentication';

export const getBlogList = async (req: Request): Promise<BlogItem[]> => {
  const blogs = await Blog.find({}).populate('createdBy').sort({ createdAt: -1 });

  return blogs.map((blog) => ({
    id: blog._id.toString(),
    title: blog.title,
    coverImageUrl: buildFileUrl(req, blog.coverImageUrl),
    createdAt: blog.createdAt,
  }));
};

export const addBlogPost = async (
  payload: AddBlogPostPayload,
  user: UserTokenPayload,
  req: Request,
): Promise<BlogCreationResponse> => {
  const blog = await Blog.create({
    title: payload.title,
    body: payload.body,
    coverImageUrl: `/uploads/${req.file?.filename}`,
    createdBy: user.id,
  });

  return {
    blog: {
      id: blog._id.toString(),
      title: blog.title,
      body: blog.body,
      coverImageUrl: buildFileUrl(req, blog.coverImageUrl),
      createdBy: {
        id: user.id,
        name: user.name,
      },
      createdAt: blog.createdAt,
    },
  };
};
