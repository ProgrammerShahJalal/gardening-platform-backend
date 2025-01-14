import mongoose, { Schema, model } from 'mongoose';
import { TPost, PostModel } from './post.interface';
import { POST_CATEGORIES } from './post.constant';

// Define the schema for a comment
const commentSchema = new Schema({
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  replies: [
    {
      content: { type: String, required: true },
      author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      createdAt: { type: Date, default: Date.now },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

const postSchema = new Schema<TPost, PostModel>(
  {
    title: { type: String, required: true, maxlength: 100 },
    content: { type: String, required: true }, // Rich text content
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the User model
    category: {
      type: String,
      enum: Object.values(POST_CATEGORIES),
      required: true,
    },
    tags: { type: [String], default: [] },
    images: { type: [String], default: [] }, // Array of image URLs
    isPremium: { type: Boolean, default: false }, // Premium content flag
    upvotes: { type: [Schema.Types.ObjectId], ref: 'User', default: [] }, // Array of user IDs for upvotes
    downvotes: { type: [Schema.Types.ObjectId], ref: 'User', default: [] }, // Array of user IDs for downvotes
    comments: [commentSchema], // Array of comments
  },
  { timestamps: true },
);

// Static method to check if a post exists by ID
postSchema.statics.isPostExistsById = async function (postId: string) {
  return await this.findById(postId);
};

export const Post = model<TPost, PostModel>('Post', postSchema);
