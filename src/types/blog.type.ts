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

export type CommentErrorResponse = {
  success: false;
  message: string;
};

export type CommentResponse = CommentSuccessResponse | CommentErrorResponse;
