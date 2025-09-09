export type CommentCreateInput = {
  content: string;
  blogId: string;
  createdBy: string;
};

export type CommentEntity = {
  id: string;
  content: string;
  blogId: string;
  createdBy: string;
  createdAt: Date;
};

export interface CommentRepository {
  create(input: CommentCreateInput): Promise<CommentEntity>;
  findById(id: string): Promise<CommentEntity | null>;
  updateContent(id: string, content: string): Promise<CommentEntity>;
}
