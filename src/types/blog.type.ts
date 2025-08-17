import { ErrorResponse } from './auth.types';
import { IBlog } from '../models/blog';
import { IComment } from '../models/comment';
import { APIResponse } from '../utils/APIResponse';

type CommentData = {
  comment: {
    id: string;
    content: string;
    createdBy: {
      id: string;
      name: string;
    };
    blogId: string;
    createdAt: Date;
  };
};

export type CommentSuccessResponse = APIResponse<CommentData>;

export type CommentResponse = CommentSuccessResponse | ErrorResponse;

type BlogWithCommentsData = {
  blog: IBlog;
  comments: IComment[];
};

type BlogWithCommentsSuccessResponse = APIResponse<BlogWithCommentsData>;

export type BlogWithCommentsResponse = BlogWithCommentsSuccessResponse | ErrorResponse;

export type AddBlogPostPayload = {
  title: string;
  body: string;
};

type BlogData = {
  blog: {
    id: string;
    title: string;
    body: string;
    coverImageUrl: string;
    createdBy: {
      id: string;
      name: string;
    };
    createdAt: Date;
  };
};

type BlogPostSuccessResponse = APIResponse<BlogData>;

export type BlogPostResponse = BlogPostSuccessResponse | ErrorResponse;
