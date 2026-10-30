import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUserPreferences {
  preferredGenres: string[];
  preferredLanguage: string;
  preferredMoods: string[];
}

export interface IUser extends Document {
  name: string;
  email?: string;
  passwordHash?: string;
  preferences: IUserPreferences;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, sparse: true, unique: true },
    passwordHash: { type: String },
    preferences: {
      preferredGenres: { type: [String], default: [] },
      preferredLanguage: { type: String, default: "English" },
      preferredMoods: { type: [String], default: [] },
    },
  },
  {
    timestamps: true,
  }
);

export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
