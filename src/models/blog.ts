import { Document, Schema, model } from 'mongoose';

interface IBlog extends Document {
  title: string;
  body: string;
  coverImageUrl?: string;
  createdBy: Schema.Types.ObjectId;
}

const blogSchema: Schema<IBlog> = new Schema(
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
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true },
);

export const Blog = model('Blog', blogSchema);
