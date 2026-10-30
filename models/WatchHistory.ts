import mongoose, { Schema, Document, Model } from "mongoose";

export interface IWatchHistory extends Document {
  userId: string;
  movieId: number;
  title: string;
  posterPath?: string | null;
  watchedAt: Date;
}

const WatchHistorySchema = new Schema<IWatchHistory>(
  {
    userId: { type: String, required: true, index: true },
    movieId: { type: Number, required: true },
    title: { type: String, required: true },
    posterPath: { type: String, default: null },
    watchedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: false,
  }
);

WatchHistorySchema.index({ userId: 1, watchedAt: -1 });

export const WatchHistory: Model<IWatchHistory> =
  mongoose.models.WatchHistory ||
  mongoose.model<IWatchHistory>("WatchHistory", WatchHistorySchema);

export default WatchHistory;
