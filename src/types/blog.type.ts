import { ErrorResponse } from './auth.types';
import { IBlog } from '../models/blog';
import { IComment } from '../models/comment';
export type CommentSuccessResponse = {
  message: string;
  success: boolean;
  data: {
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
};

export type CommentResponse = CommentSuccessResponse | ErrorResponse;

type BlogWithCommentsSuccessResponse = {
  success: true;
  message: string;
  data: {
    blog: IBlog;
    comments: IComment[];
  };
};
export type BlogWithCommentsResponse = BlogWithCommentsSuccessResponse | ErrorResponse;

export type AddBlogPostPayload = {
  title: string;
  body: string;
};
