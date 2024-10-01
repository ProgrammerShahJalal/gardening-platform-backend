import { Schema, model } from 'mongoose';
import { TPost, PostModel } from './post.interface';
import { POST_CATEGORIES } from './post.constant';

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
  },
  { timestamps: true },
);

// Static method to check if a post exists by ID
postSchema.statics.isPostExistsById = async function (postId: string) {
  return await this.findById(postId);
};

export const Post = model<TPost, PostModel>('Post', postSchema);
