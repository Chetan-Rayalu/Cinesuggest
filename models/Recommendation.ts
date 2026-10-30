import mongoose, { Schema, Document, Model } from "mongoose";

export interface IRecommendation extends Document {
  userId: string;
  prompt: string;
  mood: string;
  genre: string;
  language: string;
  movieType: string;
  recommendations: Array<{
    id: number;
    title: string;
    poster_path: string | null;
    backdrop_path?: string | null;
    release_date: string;
    vote_average: number;
    overview: string;
    genres: string[] | Array<{ id: number; name: string }>;
    aiReason?: string;
    matchScore?: number;
  }>;
  createdAt: Date;
}

const RecommendationSchema = new Schema<IRecommendation>(
  {
    userId: { type: String, required: true, index: true },
    prompt: { type: String, required: true },
    mood: { type: String, default: "Curious" },
    genre: { type: String, default: "All" },
    language: { type: String, default: "English" },
    movieType: { type: String, default: "Movies" },
    recommendations: { type: Schema.Types.Mixed, default: [] },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

RecommendationSchema.index({ userId: 1, createdAt: -1 });

export const Recommendation: Model<IRecommendation> =
  mongoose.models.Recommendation ||
  mongoose.model<IRecommendation>("Recommendation", RecommendationSchema);

export default Recommendation;
