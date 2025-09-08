// services/blog.service.ts
import { Blog } from '../models/blog';
import { Request } from 'express';
import { buildFileUrl } from '../utils/fileUrlGenerator';
import { BlogItem } from '../types/blog.type';

export const getBlogList = async (req: Request): Promise<BlogItem[]> => {
  const blogs = await Blog.find({}).populate('createdBy').sort({ createdAt: -1 });

  return blogs.map((blog) => ({
    id: blog._id.toString(),
    title: blog.title,
    coverImageUrl: buildFileUrl(req, blog.coverImageUrl),
    createdAt: blog.createdAt,
  }));
};
