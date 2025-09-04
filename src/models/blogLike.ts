import { Schema, model, Document } from 'mongoose';

export interface IBlogLike extends Document {
  blogId: Schema.Types.ObjectId;
  userId: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const BlogLikeSchema = new Schema<IBlogLike>(
  {
    blogId: { type: Schema.Types.ObjectId, ref: 'Blog', required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  },
  { timestamps: true },
);

// prevent duplicate likes
BlogLikeSchema.index({ blogId: 1, userId: 1 }, { unique: true });

export const BlogLike = model<IBlogLike>('BlogLike', BlogLikeSchema);
