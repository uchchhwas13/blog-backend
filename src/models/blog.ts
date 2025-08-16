import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IBlog extends Document {
  _id: Schema.Types.ObjectId;
  title: string;
  body: string;
  coverImageUrl: string;
  createdBy: Schema.Types.ObjectId;
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
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true },
);

export const Blog: Model<IBlog> = mongoose.model<IBlog>('Blog', blogSchema);
