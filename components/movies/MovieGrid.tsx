"use client";

import { Movie } from "@/types/movie";
import MovieCard from "./MovieCard";
import { Film } from "lucide-react";

interface MovieGridProps {
  movies: Movie[];
  isLoading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  favouriteIds?: number[];
  onFavouriteChange?: (movieId: number, isFav: boolean) => void;
  showAiReason?: boolean;
}

export default function MovieGrid({
  movies,
  isLoading = false,
  emptyTitle = "No movies discovered yet",
  emptyDescription = "Use the AI Recommender above to find movies tailored to your mood.",
  favouriteIds = [],
  onFavouriteChange,
  showAiReason = true,
}: MovieGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-zinc-900/40 p-0 animate-pulse"
          >
            <div className="aspect-[2/3] w-full bg-zinc-800/60" />
            <div className="p-4 space-y-3">
              <div className="h-5 w-3/4 rounded bg-zinc-800" />
              <div className="flex gap-2">
                <div className="h-4 w-12 rounded bg-zinc-800" />
                <div className="h-4 w-16 rounded bg-zinc-800" />
              </div>
              <div className="h-14 w-full rounded bg-zinc-800/70" />
              <div className="h-10 w-full rounded bg-zinc-800/40" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (movies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-zinc-900/30 px-6 py-16 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-950/40 border border-purple-500/20 text-purple-400 mb-4">
          <Film className="h-8 w-8" />
        </div>
        <h3 className="text-lg font-semibold text-white">{emptyTitle}</h3>
        <p className="mt-1.5 max-w-sm text-sm text-zinc-400">{emptyDescription}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          isFavouriteInitial={favouriteIds.includes(movie.id)}
          onFavouriteChange={onFavouriteChange}
          showAiReason={showAiReason}
        />
      ))}
    </div>
  );
}
