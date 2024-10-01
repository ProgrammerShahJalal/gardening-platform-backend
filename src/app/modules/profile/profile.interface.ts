import { Document, Model } from 'mongoose';

export interface TProfile {
  name: string;
  email: string;
  profilePicture?: string;
  isVerified: boolean;
  badge?: string;
  followers: string[];
  following: string[];
}

export interface TProfileDocument extends TProfile, Document {}
