const { Schema, model } = require('mongoose');

const commentSchema = new Schema(
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

const Comment = model('Comment', commentSchema);
module.exports = Comment;
