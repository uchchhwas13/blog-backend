import { APIResponse } from '../utils/APIResponse';

export type CommentData = {
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

export type CommentResponse = APIResponse<CommentData>;

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

export type BlogWithCommentsResponse = APIResponse<BlogWithCommentsData>;

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
export type BlogListAPIResponse = APIResponse<BlogListData>;

type BlogLikeStatus = {
  isLiked: boolean;
};

export type BlogLikeResponse = APIResponse<BlogLikeStatus>;

type LikedUserInfo = {
  userId: string;
  name: string;
  imageUrl: string;
};
type BlogLikesData = {
  totalLikes: number;
  users: LikedUserInfo[];
};
export type BlogLikesResponse = APIResponse<BlogLikesData>;
