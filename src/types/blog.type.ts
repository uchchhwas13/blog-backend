import { ErrorResponse } from './auth.types';
import { APIResponse } from '../utils/APIResponse';

type CommentData = {
  comment: {
    id: string;
    content: string;
    blogId: string;
    createdAt: Date;
    createdBy: {
      name: string;
      imageUrl: string;
    };
  };
};

export type CommentSuccessResponse = APIResponse<CommentData>;

export type CommentResponse = CommentSuccessResponse | ErrorResponse;

type BlogDetail = {
  id: string;
  title: string;
  body: string;
  coverImageUrl: string;
  isLikedByUser: boolean;
  totalLikes: number;
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

export type BlogCreationResponse = {
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
export type BlogPostResponse = APIResponse<BlogCreationResponse>;

export type BlogItem = {
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

type BlogLikeStatus = {
  isLiked: boolean;
};

type BlogLikeSuccessResponse = APIResponse<BlogLikeStatus>;
export type BlogLikeResponse = BlogLikeSuccessResponse | ErrorResponse;

type LikedUserInfo = {
  userId: string;
  name: string;
  imageUrl: string;
};
type BlogLikesData = {
  totalLikes: number;
  users: LikedUserInfo[];
};
type BlogLikesSuccessResponse = APIResponse<BlogLikesData>;
export type BlogLikesResponse = BlogLikesSuccessResponse | ErrorResponse;
