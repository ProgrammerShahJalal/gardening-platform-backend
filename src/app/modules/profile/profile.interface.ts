import { Document } from 'mongoose';

export interface TProfile {
  name: string;
  email: string;
  phone: string;
  address: string;
  role: string;
  profilePicture?: string;
  isVerified: boolean;
  followers: string[];
  following: string[];
  upvotes?: number;
}

export interface TProfileDocument extends TProfile, Document {}
