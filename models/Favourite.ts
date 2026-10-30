import mongoose, { Schema, Document, Model } from "mongoose";

export interface IFavourite extends Document {
  userId: string;
  movieId: number;
  title: string;
  posterPath?: string | null;
  releaseDate?: string;
  rating?: number;
  genres?: string[];
  createdAt: Date;
}

const FavouriteSchema = new Schema<IFavourite>(
  {
    userId: { type: String, required: true, index: true },
    movieId: { type: Number, required: true },
    title: { type: String, required: true },
    posterPath: { type: String, default: null },
    releaseDate: { type: String, default: "" },
    rating: { type: Number, default: 0 },
    genres: { type: [String], default: [] },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

// Compound unique index on userId and movieId to prevent duplicates
FavouriteSchema.index({ userId: 1, movieId: 1 }, { unique: true });

export const Favourite: Model<IFavourite> =
  mongoose.models.Favourite || mongoose.model<IFavourite>("Favourite", FavouriteSchema);

export default Favourite;
