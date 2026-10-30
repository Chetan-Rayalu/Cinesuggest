"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, Trash2, ArrowRight, Star, Film, ExternalLink, Sparkles } from "lucide-react";
import { FavouriteItem } from "@/types/recommendation";
import { getTMDBPosterUrl } from "@/lib/tmdb";
import toast from "react-hot-toast";

export default function FavouritesPage() {
  const [favourites, setFavourites] = useState<FavouriteItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchFavourites();
  }, []);

  const fetchFavourites = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/favourites");
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setFavourites(data.data);
      }
    } catch {
      toast.error("Failed to load favourites.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = async (movieId: number, title: string) => {
    try {
      const res = await fetch(`/api/favourites/${movieId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setFavourites((prev) => prev.filter((item) => item.movieId !== movieId));
        toast.success(`Removed "${title}" from favourites.`, {
          style: { background: "#18181b", color: "#fff", border: "1px solid #3f3f46" },
        });
      }
    } catch {
      toast.error("Failed to remove favourite.");
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/[0.08] pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-400">
            <Heart className="h-4 w-4 fill-purple-400" />
            <span>Personal Cinema Collection</span>
          </div>
          <h1 className="mt-1 text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Saved Favourites
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            Your private library of movie discoveries persisted across your sessions.
          </p>
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl bg-purple-600/20 border border-purple-500/30 px-4 py-2 text-xs font-semibold text-purple-300 hover:bg-purple-600/30 transition-colors"
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>Discover More Titles</span>
        </Link>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="aspect-[2/3] w-full rounded-2xl bg-zinc-900/60 border border-white/[0.06] animate-pulse"
            />
          ))}
        </div>
      ) : favourites.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 bg-zinc-900/20 px-6 py-20 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-950/30 border border-red-500/20 text-red-400 mb-4">
            <Heart className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-bold text-white">No favourite movies yet</h2>
          <p className="mt-2 max-w-sm text-sm text-zinc-400">
            Whenever you discover a movie you want to remember, click the heart icon on any movie card to save it here.
          </p>
          <Link
            href="/"
            className="mt-6 flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-900/40 hover:opacity-90 transition-opacity"
          >
            <span>Ask CineSuggest AI</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {favourites.map((fav) => (
            <div
              key={fav.movieId}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-[#121118]/90 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-purple-500/40 hover:shadow-2xl hover:shadow-purple-950/30"
            >
              <div className="relative aspect-[2/3] w-full bg-zinc-950 overflow-hidden">
                <Image
                  src={getTMDBPosterUrl(fav.posterPath)}
                  alt={fav.title}
                  fill
                  unoptimized
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121118] via-transparent to-transparent" />

                {/* Rating badge */}
                <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-md bg-black/60 px-2 py-0.5 text-xs font-semibold text-yellow-300 backdrop-blur-md border border-white/10">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span>{fav.rating ? fav.rating.toFixed(1) : "N/A"}</span>
                </div>

                {/* Delete button */}
                <button
                  onClick={() => handleRemove(fav.movieId, fav.title)}
                  title="Remove from favourites"
                  className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-zinc-400 backdrop-blur-md border border-white/10 hover:bg-red-950/80 hover:text-red-300 hover:border-red-500/40 transition-all"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="flex flex-1 flex-col p-4">
                <Link
                  href={`/movies/${fav.movieId}`}
                  className="font-semibold text-base text-white hover:text-purple-300 transition-colors line-clamp-1"
                >
                  {fav.title}
                </Link>

                {fav.releaseDate && (
                  <span className="text-xs text-zinc-400 mt-1">
                    Released: {fav.releaseDate}
                  </span>
                )}

                <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between">
                  <Link
                    href={`/movies/${fav.movieId}`}
                    className="flex items-center gap-1.5 text-xs font-semibold text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    <span>View Movie Details</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
