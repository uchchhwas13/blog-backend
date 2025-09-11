import mongoose, { Schema, Model } from 'mongoose';

export interface IComment extends Document {
  _id: Schema.Types.ObjectId;
  content: string;
  createdBy: Schema.Types.ObjectId;
  blogId: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const commentSchema = new Schema<IComment>(
  {
    content: {
      type: String,
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    blogId: {
      type: Schema.Types.ObjectId,
      ref: 'Blog',
      required: true,
    },
  },
  { timestamps: true },
);

export const Comment = mongoose.model<IComment>('Comment', commentSchema);
