"use client";

import { useEffect, useState } from "react";
import { Movie } from "@/types/movie";
import MovieGrid from "../movies/MovieGrid";
import { Sparkles, RefreshCw, AlertCircle, Compass } from "lucide-react";

interface RecommendationResultsProps {
  movies: Movie[];
  isLoading: boolean;
  error?: string | null;
  prompt?: string;
  mood?: string;
  genre?: string;
  language?: string;
  onRetry?: () => void;
  favouriteIds?: number[];
  onFavouriteChange?: (movieId: number, isFav: boolean) => void;
}

const AI_LOADING_STEPS = [
  "Interpreting mood and emotional undertones...",
  "Querying Google Gemini AI for curated cinematic matches...",
  "Cross-referencing verified metadata and high-res posters from TMDB...",
  "Evaluating aesthetic harmony and calculating match scores...",
  "Polishing personalized recommendation rationales...",
];

export default function RecommendationResults({
  movies,
  isLoading,
  error,
  prompt,
  mood,
  genre,
  language,
  onRetry,
  favouriteIds = [],
  onFavouriteChange,
}: RecommendationResultsProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    if (!isLoading) {
      setCurrentStepIndex(0);
      return;
    }

    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => (prev + 1) % AI_LOADING_STEPS.length);
    }, 1800);

    return () => clearInterval(interval);
  }, [isLoading]);

  if (isLoading) {
    return (
      <div className="space-y-8 py-8">
        {/* Loading header */}
        <div className="flex flex-col items-center justify-center text-center space-y-3">
          <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-600/20 text-purple-400 border border-purple-500/30 purple-glow">
            <Sparkles className="h-7 w-7 animate-spin text-purple-300" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">AI Discovery in Progress</h3>
            <p className="mt-1 text-sm text-purple-300/80 animate-pulse transition-all">
              {AI_LOADING_STEPS[currentStepIndex]}
            </p>
          </div>
        </div>

        {/* Skeleton Grid */}
        <MovieGrid movies={[]} isLoading={true} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border border-red-500/20 bg-red-950/20 p-8 text-center backdrop-blur-md">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-900/30 text-red-400 mb-3">
          <AlertCircle className="h-6 w-6" />
        </div>
        <h4 className="text-base font-semibold text-white">Recommendation Error</h4>
        <p className="mt-1 max-w-md text-sm text-red-200/80">{error}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-4 flex items-center gap-2 rounded-xl bg-zinc-800 px-4 py-2 text-xs font-semibold text-white hover:bg-zinc-700 transition-colors"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Try Again</span>
          </button>
        )}
      </div>
    );
  }

  if (movies.length === 0) {
    return null;
  }

  return (
    <section className="space-y-6 pt-4">
      {/* Results Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/[0.08] pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-400">
            <Sparkles className="h-4 w-4" />
            <span>AI Powered Recommendations</span>
          </div>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-white">
            Curated 5 Matches For You
          </h2>
          {prompt && (
            <p className="mt-1 text-sm text-zinc-400 italic">
              &ldquo;{prompt}&rdquo;
            </p>
          )}
        </div>

        {/* Active Filters Badges */}
        <div className="flex flex-wrap items-center gap-2">
          {mood && (
            <span className="rounded-full border border-purple-500/30 bg-purple-950/40 px-3 py-1 text-xs font-medium text-purple-300">
              Mood: {mood}
            </span>
          )}
          {genre && genre !== "All" && (
            <span className="rounded-full border border-white/10 bg-zinc-900/80 px-3 py-1 text-xs font-medium text-zinc-300">
              Genre: {genre}
            </span>
          )}
          {language && (
            <span className="rounded-full border border-white/10 bg-zinc-900/80 px-3 py-1 text-xs font-medium text-zinc-300">
              {language}
            </span>
          )}
        </div>
      </div>

      {/* Grid of 5 movies */}
      <MovieGrid
        movies={movies}
        favouriteIds={favouriteIds}
        onFavouriteChange={onFavouriteChange}
        showAiReason={true}
      />
    </section>
  );
}
