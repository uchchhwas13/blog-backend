import { Schema, model, Document } from 'mongoose';

export interface IBlogLike extends Document {
  blogId: Schema.Types.ObjectId;
  userId: Schema.Types.ObjectId;
  isLiked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const blogLikeSchema = new Schema<IBlogLike>(
  {
    blogId: { type: Schema.Types.ObjectId, ref: 'Blog', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    isLiked: { type: Boolean, default: false },
  },
  { timestamps: true },
);

blogLikeSchema.index({ blogId: 1, userId: 1 }, { unique: true });

export const BlogLike = model<IBlogLike>('BlogLike', blogLikeSchema);
