import mongoose, { Schema, Model } from 'mongoose';

interface IComment extends Document {
  content: string;
  createdBy: Schema.Types.ObjectId;
  blogId: Schema.Types.ObjectId;
}

const commentSchema: Schema<IComment> = new Schema(
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

export const Blog: Model<IComment> = mongoose.model<IComment>('Comment', commentSchema);
