import { ErrorResponse } from './auth.types';
import { APIResponse } from '../utils/APIResponse';

type CommentData = {
  comment: {
    id: string;
    content: string;
    blogId: string;
    createdAt: Date;
  };
};

export type CommentSuccessResponse = APIResponse<CommentData>;

export type CommentResponse = CommentSuccessResponse | ErrorResponse;

type BlogDetail = {
  id: string;
  title: string;
  body: string;
  coverImageUrl: string;
  createdBy: {
    name: string;
    imageUrl: string;
  };
  createdAt: Date;
};

type Comment = {
  id: string;
  content: string;
  createdBy: {
    name: string;
    imageUrl: string;
  };
  createdAt: Date;
};

type BlogWithCommentsData = {
  blog: BlogDetail;
  comments: Comment[];
};

type BlogWithCommentsSuccessResponse = APIResponse<BlogWithCommentsData>;

export type BlogWithCommentsResponse = BlogWithCommentsSuccessResponse | ErrorResponse;

export type AddBlogPostPayload = {
  title: string;
  body: string;
};

type BlogCreationResponse = {
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

type BlogPostSuccessResponse = APIResponse<BlogCreationResponse>;
export type BlogPostResponse = BlogPostSuccessResponse | ErrorResponse;

type BlogItem = {
  id: string;
  title: string;
  coverImageUrl: string;
  createdAt: Date;
};

type BlogListData = {
  blogs: BlogItem[];
};
type BlogListSuccessResponse = APIResponse<BlogListData>;
export type BlogListAPIResponse = BlogListSuccessResponse | ErrorResponse;
