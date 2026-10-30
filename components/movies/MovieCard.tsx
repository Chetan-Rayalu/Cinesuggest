"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Heart, Sparkles, Clock, ArrowRight, Share2 } from "lucide-react";
import { Movie } from "@/types/movie";
import { getTMDBPosterUrl } from "@/lib/tmdb";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

interface MovieCardProps {
  movie: Movie;
  isFavouriteInitial?: boolean;
  onFavouriteChange?: (movieId: number, isFav: boolean) => void;
  showAiReason?: boolean;
}

export default function MovieCard({
  movie,
  isFavouriteInitial = false,
  onFavouriteChange,
  showAiReason = true,
}: MovieCardProps) {
  const [isFav, setIsFav] = useState(isFavouriteInitial);
  const [isLoadingFav, setIsLoadingFav] = useState(false);
  const [imgSrc, setImgSrc] = useState(getTMDBPosterUrl(movie.poster_path));

  const toggleFavourite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isLoadingFav) return;
    setIsLoadingFav(true);

    const nextState = !isFav;
    setIsFav(nextState);

    try {
      if (nextState) {
        const res = await fetch("/api/favourites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            movieId: movie.id,
            title: movie.title,
            posterPath: movie.poster_path,
            releaseDate: movie.release_date,
            rating: movie.vote_average,
            genres: Array.isArray(movie.genres)
              ? movie.genres.map((g) => (typeof g === "string" ? g : g.name))
              : [],
          }),
        });
        if (res.ok) {
          toast.success(`Added "${movie.title}" to favourites!`, {
            style: { background: "#18181b", color: "#fff", border: "1px solid #8b5cf6" },
          });
          onFavouriteChange?.(movie.id, true);
        } else {
          setIsFav(!nextState);
          toast.error("Could not add to favourites.");
        }
      } else {
        const res = await fetch(`/api/favourites/${movie.id}`, {
          method: "DELETE",
        });
        if (res.ok) {
          toast.success(`Removed "${movie.title}" from favourites.`, {
            style: { background: "#18181b", color: "#fff", border: "1px solid #3f3f46" },
          });
          onFavouriteChange?.(movie.id, false);
        } else {
          setIsFav(!nextState);
          toast.error("Could not remove from favourites.");
        }
      }
    } catch (err) {
      setIsFav(!nextState);
      toast.error("Network error while updating favourites.");
    } finally {
      setIsLoadingFav(false);
    }
  };

  const formattedGenres = Array.isArray(movie.genres)
    ? movie.genres.map((g) => (typeof g === "string" ? g : g.name)).slice(0, 3)
    : [];

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-[#121118]/80 backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:border-purple-500/40 hover:shadow-2xl hover:shadow-purple-950/40">
      {/* Poster Media Section */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-zinc-950">
        <Image
          src={imgSrc}
          alt={movie.title}
          fill
          unoptimized
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          onError={() => setImgSrc("/placeholder-poster.svg")}
          priority={false}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#121118] via-transparent to-black/40" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          {movie.matchScore ? (
            <div className="flex items-center gap-1.5 rounded-full border border-purple-400/40 bg-purple-950/80 px-2.5 py-1 text-xs font-semibold text-purple-300 backdrop-blur-md shadow-lg shadow-purple-950/60">
              <Sparkles className="h-3 w-3 text-yellow-300" />
              <span>{movie.matchScore}% Match</span>
              <span className="text-[10px] opacity-75 hidden sm:inline">(AI estimate)</span>
            </div>
          ) : (
            <span />
          )}

          {/* Favourite Button */}
          <button
            onClick={toggleFavourite}
            disabled={isLoadingFav}
            aria-label={isFav ? "Remove from favourites" : "Add to favourites"}
            className={cn(
              "pointer-events-auto flex h-9 w-9 items-center justify-center rounded-full border backdrop-blur-md transition-all duration-200 active:scale-90",
              isFav
                ? "border-red-500/50 bg-red-500/20 text-red-400 shadow-lg shadow-red-950/40"
                : "border-white/10 bg-black/50 text-white/80 hover:bg-black/70 hover:text-white"
            )}
          >
            <Heart className={cn("h-4 w-4", isFav && "fill-red-500 text-red-500")} />
          </button>
        </div>

        {/* Rating and Year overlay on bottom of image */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs font-medium text-white/90">
          <div className="flex items-center gap-1.5 rounded-md bg-black/60 px-2 py-0.5 backdrop-blur-md border border-white/10">
            <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
            <span className="font-bold text-yellow-300">{movie.vote_average.toFixed(1)}</span>
            <span className="text-zinc-400 text-[10px]">TMDB</span>
          </div>

          <div className="flex items-center gap-2">
            {movie.year && (
              <span className="rounded-md bg-black/60 px-2 py-0.5 text-zinc-300 backdrop-blur-md border border-white/10">
                {movie.year}
              </span>
            )}
            {movie.runtime && (
              <span className="hidden sm:flex items-center gap-1 rounded-md bg-black/60 px-2 py-0.5 text-zinc-300 backdrop-blur-md border border-white/10">
                <Clock className="h-3 w-3 text-zinc-400" />
                <span>{movie.runtime}m</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Movie Details Content */}
      <div className="flex flex-1 flex-col p-4">
        {/* Title */}
        <Link
          href={`/movies/${movie.id}`}
          className="group/title block font-semibold text-base text-white hover:text-purple-300 transition-colors line-clamp-1"
        >
          {movie.title}
        </Link>

        {/* Genre Tags */}
        {formattedGenres.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {formattedGenres.map((genre) => (
              <span
                key={genre}
                className="rounded-md border border-white/[0.06] bg-zinc-900/60 px-2 py-0.5 text-[11px] font-medium text-zinc-400"
              >
                {genre}
              </span>
            ))}
          </div>
        )}

        {/* OTT Streaming Availability Preview */}
        {movie.ottProviders && movie.ottProviders.length > 0 && (
          <div className="mt-2.5 flex items-center gap-1.5 overflow-hidden rounded-lg bg-zinc-950/70 border border-white/[0.06] px-2 py-1">
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              OTT:
            </span>
            <div className="flex items-center gap-1 overflow-hidden min-w-0">
              {movie.ottProviders.slice(0, 2).map((prov) => (
                <div
                  key={prov.provider_id}
                  title={`Stream on ${prov.provider_name}`}
                  className="flex items-center gap-1 rounded bg-zinc-900 border border-white/10 px-1.5 py-0.5 shrink-0"
                >
                  {prov.logo_path && (
                    <img
                      src={prov.logo_path}
                      alt={prov.provider_name}
                      className="h-3 w-3 rounded-sm object-cover"
                    />
                  )}
                  <span className="text-[10px] text-zinc-300 font-medium truncate max-w-[85px]">
                    {prov.provider_name}
                  </span>
                </div>
              ))}
              {movie.ottProviders.length > 2 && (
                <span className="text-[10px] text-zinc-500 font-medium shrink-0">
                  +{movie.ottProviders.length - 2}
                </span>
              )}
            </div>
          </div>
        )}

        {/* AI Recommendation Reason */}
        {showAiReason && movie.aiReason && (
          <div className="mt-3 rounded-xl border border-purple-500/20 bg-purple-950/20 p-2.5 backdrop-blur-sm">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-purple-300">
              <Sparkles className="h-3 w-3 text-purple-400" />
              <span>Why CineSuggest Recommends This</span>
            </div>
            <p className="mt-1 text-xs leading-relaxed text-purple-200/90 line-clamp-2">
              {movie.aiReason}
            </p>
          </div>
        )}

        {/* Overview */}
        <p className="mt-3 flex-1 text-xs leading-relaxed text-zinc-400 line-clamp-3">
          {movie.overview}
        </p>

        {/* Footer Actions */}
        <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between">
          <Link
            href={`/movies/${movie.id}`}
            className="flex items-center gap-1.5 text-xs font-semibold text-purple-400 hover:text-purple-300 transition-colors group-hover:translate-x-0.5"
          >
            <span>View Full Details</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: movie.title,
                  text: `Check out ${movie.title} on CineSuggest!`,
                  url: `${window.location.origin}/movies/${movie.id}`,
                }).catch(() => {});
              } else {
                navigator.clipboard.writeText(`${window.location.origin}/movies/${movie.id}`);
                toast.success("Link copied to clipboard!");
              }
            }}
            aria-label="Share movie"
            className="p-1.5 text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            <Share2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
