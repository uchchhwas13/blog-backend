import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IBlog extends Document {
  _id: Schema.Types.ObjectId;
  title: string;
  body: string;
  coverImageUrl: string;
  createdBy: Schema.Types.ObjectId;
  likeCount: number;
  isLikedByUser: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const blogSchema = new Schema<IBlog>(
  {
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    coverImageUrl: {
      type: String,
      required: true,
    },
    likeCount: {
      type: Number,
      default: 0,
    },
    isLikedByUser: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true },
);

export const Blog = mongoose.model<IBlog>('Blog', blogSchema);
