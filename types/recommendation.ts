import { Movie } from "./movie";

export type MoodType =
  | "Happy"
  | "Sad"
  | "Excited"
  | "Curious"
  | "Relaxed"
  | "Romantic"
  | "Adventurous"
  | "Suspenseful";

export type GenreType =
  | "Action"
  | "Adventure"
  | "Comedy"
  | "Drama"
  | "Horror"
  | "Romance"
  | "Science Fiction"
  | "Thriller"
  | "Mystery"
  | "Animation";

export type LanguageType =
  | "English"
  | "Telugu"
  | "Hindi"
  | "Tamil"
  | "Malayalam"
  | "Kannada"
  | "Japanese"
  | "Korean";

export type MovieCategoryType = "Movies" | "Animated movies" | "Any";

export interface RecommendationRequest {
  prompt: string;
  mood?: string;
  genre?: string;
  language?: string;
  movieType?: MovieCategoryType;
}

export interface GeminiRecommendationItem {
  title: string;
  year: number;
  reason: string;
  matchScore: number;
}

export interface GeminiRecommendationOutput {
  recommendations: GeminiRecommendationItem[];
}

export interface RecommendationHistoryItem {
  _id?: string;
  id?: string;
  userId: string;
  prompt: string;
  mood: string;
  genre: string;
  language: string;
  movieType: string;
  recommendations: Movie[];
  createdAt: string;
}

export interface FavouriteItem {
  _id?: string;
  userId: string;
  movieId: number;
  title: string;
  posterPath: string | null;
  releaseDate: string;
  rating: number;
  genres?: string[];
  createdAt?: string;
}
