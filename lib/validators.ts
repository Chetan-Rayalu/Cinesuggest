import { z } from "zod";

export const recommendationRequestSchema = z.object({
  prompt: z.string().min(1, "Prompt is required").max(600, "Prompt must be 600 characters or less"),
  mood: z.string().max(50).optional().default("Curious"),
  genre: z.string().max(50).optional().default("All"),
  language: z.string().max(50).optional().default("English"),
  movieType: z.enum(["Movies", "Animated movies", "Any"]).optional().default("Movies"),
});

export const favouriteRequestSchema = z.object({
  movieId: z.number().int().positive("Valid movie ID is required"),
  title: z.string().min(1, "Movie title is required"),
  posterPath: z.string().nullable().optional(),
  releaseDate: z.string().optional().default(""),
  rating: z.number().min(0).max(10).optional().default(0),
  genres: z.array(z.string()).optional().default([]),
});

export type ValidatedRecommendationRequest = z.infer<typeof recommendationRequestSchema>;
export type ValidatedFavouriteRequest = z.infer<typeof favouriteRequestSchema>;
