import { Schema, model } from 'mongoose';

export interface IUser {
  _id: string;
  username: string;
  passwordHash: string;
  preferences: {
    preferredStyles: string[];
    preferredColors: string[];
    dislikedColors: string[];
    preferredFormality: number | null;
  };
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 50,
      match: /^[a-zA-Z0-9_-]+$/,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    preferences: {
      preferredStyles: [String],
      preferredColors: [String],
      dislikedColors: [String],
      preferredFormality: {
        type: Number,
        min: 1,
        max: 5,
        default: null,
      },
    },
  },
  { timestamps: true }
);

export const User = model<IUser>('User', userSchema);
