import { Document, Model, Types } from 'mongoose';
import { PostCategory } from './post.constant';

export interface TPost {
  title: string;
  content: string; // HTML or Markdown content from the rich text editor
  author: Types.ObjectId; // User ID of the post author
  category: PostCategory;
  tags: string[];
  images: string[]; // URLs of attached images
  isPremium: boolean; // If true, only verified users can access the post
}

// Extend Document to include Mongoose instance methods
export interface TPostDocument extends TPost, Document {}

// Static methods for post model
export interface PostModel extends Model<TPostDocument> {
  isPostExistsById(postId: string): Promise<TPostDocument | null>;
}
