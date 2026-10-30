"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Star,
  Clock,
  Calendar,
  Heart,
  Sparkles,
  ArrowLeft,
  Play,
  Share2,
  Film,
  Tv,
  ExternalLink,
  Globe,
  CheckCircle2,
} from "lucide-react";
import { Movie } from "@/types/movie";
import { getTMDBBackdropUrl, getTMDBPosterUrl } from "@/lib/tmdb";
import MovieCard from "./MovieCard";
import toast from "react-hot-toast";

interface MovieDetailsProps {
  movie: Movie;
  similarMovies: Movie[];
  isFavouriteInitial?: boolean;
}

export default function MovieDetails({
  movie,
  similarMovies,
  isFavouriteInitial = false,
}: MovieDetailsProps) {
  const [isFav, setIsFav] = useState(isFavouriteInitial);
  const [isLoadingFav, setIsLoadingFav] = useState(false);
  const [showTrailerModal, setShowTrailerModal] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<"IN" | "US" | "GLOBAL">("IN");

  const toggleFavourite = async () => {
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
        } else {
          setIsFav(!nextState);
          toast.error("Could not add to favourites.");
        }
      } else {
        const res = await fetch(`/api/favourites/${movie.id}`, {
          method: "DELETE",
        });
        if (res.ok) {
          toast.success(`Removed from favourites.`, {
            style: { background: "#18181b", color: "#fff", border: "1px solid #3f3f46" },
          });
        } else {
          setIsFav(!nextState);
          toast.error("Could not remove from favourites.");
        }
      }
    } catch {
      setIsFav(!nextState);
      toast.error("Error updating favourites.");
    } finally {
      setIsLoadingFav(false);
    }
  };

  const backdropUrl = getTMDBBackdropUrl(movie.backdrop_path);
  const posterUrl = getTMDBPosterUrl(movie.poster_path);

  const formatRuntime = (mins?: number | null) => {
    if (!mins) return null;
    const hours = Math.floor(mins / 60);
    const remainingMins = mins % 60;
    return `${hours}h ${remainingMins}m`;
  };

  const formattedGenres = Array.isArray(movie.genres)
    ? movie.genres.map((g) => (typeof g === "string" ? g : g.name))
    : [];

  // Active Watch Providers logic
  const watchResults = movie.watchProviders || {};
  const currentRegionData =
    selectedRegion === "IN"
      ? watchResults.IN
      : selectedRegion === "US"
      ? watchResults.US
      : watchResults.IN || watchResults.US || Object.values(watchResults)[0];

  const streamingProviders =
    currentRegionData?.flatrate && currentRegionData.flatrate.length > 0
      ? currentRegionData.flatrate
      : selectedRegion === "GLOBAL" && movie.ottProviders && movie.ottProviders.length > 0
      ? movie.ottProviders
      : [];

  const rentProviders = currentRegionData?.rent || [];
  const buyProviders = currentRegionData?.buy || [];
  const justWatchLink = currentRegionData?.link || movie.watchLink;

  const otherRegionsWithStreaming = Object.entries(watchResults).filter(
    ([code, data]) => code !== selectedRegion && data?.flatrate && data.flatrate.length > 0
  );

  return (
    <div className="relative min-h-screen">
      {/* Hero Backdrop Banner */}
      <div className="relative h-[60vh] min-h-[420px] w-full overflow-hidden">
        <Image
          src={backdropUrl}
          alt={movie.title}
          fill
          unoptimized
          priority
          className="object-cover object-center filter brightness-60"
        />
        {/* Cinematic Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#09090b] via-transparent to-transparent" />

        {/* Back Link */}
        <div className="absolute top-6 left-4 sm:left-8 z-20">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-full border border-white/10 bg-black/60 px-4 py-2 text-sm font-medium text-white backdrop-blur-md hover:bg-black/80 hover:border-purple-500/50 transition-all"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Discovery</span>
          </Link>
        </div>
      </div>

      {/* Main Content Info Container */}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-56 z-10 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column: Large Poster */}
          <div className="md:col-span-4 lg:col-span-3">
            <div className="relative aspect-[2/3] w-full overflow-hidden rounded-2xl border-2 border-white/10 bg-zinc-950 shadow-2xl purple-glow">
              <Image
                src={posterUrl}
                alt={movie.title}
                fill
                unoptimized
                priority
                className="object-cover"
              />
            </div>

            {/* Quick Actions Under Poster */}
            <div className="mt-4 flex flex-col gap-2.5">
              {streamingProviders.length > 0 && (
                <div className="flex items-center justify-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-950/30 py-2.5 px-3 text-xs font-semibold text-emerald-300">
                  <Tv className="h-4 w-4 text-emerald-400" />
                  <span className="truncate">Streaming on {streamingProviders[0].provider_name}</span>
                </div>
              )}

              <button
                onClick={toggleFavourite}
                disabled={isLoadingFav}
                className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-zinc-900/80 py-3 text-sm font-semibold text-white backdrop-blur-md hover:bg-zinc-800 transition-colors"
              >
                <Heart
                  className={`h-4 w-4 ${isFav ? "fill-red-500 text-red-500" : "text-white"}`}
                />
                <span>{isFav ? "In Favourites" : "Add to Favourites"}</span>
              </button>

              {movie.trailerKey && (
                <button
                  onClick={() => setShowTrailerModal(true)}
                  className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-900/40 hover:opacity-90 transition-opacity"
                >
                  <Play className="h-4 w-4 fill-white" />
                  <span>Watch Trailer</span>
                </button>
              )}
            </div>
          </div>

          {/* Right Column: Information & Overview */}
          <div className="md:col-span-8 lg:col-span-9 space-y-6">
            {/* Title & Tagline */}
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
                  {movie.title}
                </h1>
                {movie.year && (
                  <span className="text-xl sm:text-2xl text-zinc-400 font-medium">
                    ({movie.year})
                  </span>
                )}
              </div>
              {movie.tagline && (
                <p className="mt-2 text-base sm:text-lg italic text-purple-300/80">
                  &ldquo;{movie.tagline}&rdquo;
                </p>
              )}
            </div>

            {/* Meta Row: Rating, Runtime, Date, Genres */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-300">
              {/* TMDB Rating */}
              <div className="flex items-center gap-1.5 rounded-lg border border-yellow-500/30 bg-yellow-500/10 px-3 py-1 font-semibold text-yellow-300">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span>{movie.vote_average.toFixed(1)}</span>
                <span className="text-[11px] text-zinc-400">
                  {movie.vote_count ? `(${movie.vote_count.toLocaleString()} votes)` : "TMDB"}
                </span>
              </div>

              {/* Runtime */}
              {movie.runtime ? (
                <div className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-zinc-900/60 px-3 py-1">
                  <Clock className="h-4 w-4 text-zinc-400" />
                  <span>{formatRuntime(movie.runtime)}</span>
                </div>
              ) : null}

              {/* Release Date */}
              {movie.release_date && (
                <div className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-zinc-900/60 px-3 py-1">
                  <Calendar className="h-4 w-4 text-zinc-400" />
                  <span>{movie.release_date}</span>
                </div>
              )}
            </div>

            {/* Genres */}
            {formattedGenres.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {formattedGenres.map((genre) => (
                  <span
                    key={genre}
                    className="rounded-full border border-purple-500/30 bg-purple-950/40 px-3.5 py-1 text-xs font-semibold text-purple-200"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            )}

            {/* AI Recommendation Reason */}
            {movie.aiReason && (
              <div className="rounded-2xl border border-purple-500/30 bg-purple-950/20 p-5 backdrop-blur-md purple-glow-sm">
                <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-purple-300">
                  <Sparkles className="h-4 w-4 text-yellow-300" />
                  <span>Why CineSuggest Recommends This</span>
                </div>
                <p className="mt-2 text-sm sm:text-base leading-relaxed text-purple-100">
                  {movie.aiReason}
                </p>
              </div>
            )}

            {/* Synopsis / Overview */}
            <div className="space-y-2 pt-2">
              <h2 className="text-xl font-bold tracking-tight text-white">
                Synopsis
              </h2>
              <p className="text-sm sm:text-base leading-relaxed text-zinc-300 max-w-3xl">
                {movie.overview}
              </p>
            </div>

            {/* Where to Watch / OTT Streaming Providers */}
            <div className="rounded-2xl border border-white/[0.1] bg-[#14131d]/90 p-5 sm:p-6 backdrop-blur-md shadow-xl space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30">
                    <Tv className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                      Where to Watch (OTT)
                      <span className="text-[10px] uppercase font-semibold tracking-wider rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 px-2 py-0.5">
                        Live Data
                      </span>
                    </h2>
                    <p className="text-xs text-zinc-400">
                      Official streaming platforms & digital rental availability
                    </p>
                  </div>
                </div>

                {/* Country Region Switcher */}
                <div className="flex items-center gap-1 rounded-xl bg-zinc-900/90 p-1 border border-white/10 self-start sm:self-auto">
                  <button
                    onClick={() => setSelectedRegion("IN")}
                    className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                      selectedRegion === "IN"
                        ? "bg-purple-600 text-white shadow-md shadow-purple-900/50"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    <span>🇮🇳</span>
                    <span>India</span>
                  </button>
                  <button
                    onClick={() => setSelectedRegion("US")}
                    className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                      selectedRegion === "US"
                        ? "bg-purple-600 text-white shadow-md shadow-purple-900/50"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    <span>🇺🇸</span>
                    <span>USA</span>
                  </button>
                  <button
                    onClick={() => setSelectedRegion("GLOBAL")}
                    className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                      selectedRegion === "GLOBAL"
                        ? "bg-purple-600 text-white shadow-md shadow-purple-900/50"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    <Globe className="h-3 w-3" />
                    <span>Global</span>
                  </button>
                </div>
              </div>

              {/* Streaming (Flatrate) List */}
              {streamingProviders.length > 0 ? (
                <div className="space-y-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    Included with Subscription (Stream Now)
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {streamingProviders.map((provider) => (
                      <div
                        key={provider.provider_id}
                        className="group flex items-center gap-3 rounded-xl border border-white/[0.08] bg-zinc-900/70 p-2.5 hover:border-purple-500/40 hover:bg-zinc-800/80 transition-all shadow-sm"
                      >
                        {provider.logo_path ? (
                          <img
                            src={provider.logo_path}
                            alt={provider.provider_name}
                            className="h-10 w-10 rounded-lg object-cover border border-white/10 shrink-0 group-hover:scale-105 transition-transform"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-lg bg-zinc-800 flex items-center justify-center border border-white/10 shrink-0">
                            <Tv className="h-5 w-5 text-zinc-400" />
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="text-xs sm:text-sm font-semibold text-white truncate">
                            {provider.provider_name}
                          </p>
                          <span className="text-[10px] text-emerald-400 font-medium">
                            Subscription
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                /* Empty state for subscription streaming */
                <div className="rounded-xl border border-white/5 bg-zinc-900/40 p-4 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <p className="text-xs sm:text-sm text-zinc-300 font-medium">
                      Not currently streaming on subscription OTT in {selectedRegion === "IN" ? "India" : selectedRegion === "US" ? "the United States" : "this region"}.
                    </p>
                    <p className="text-xs text-zinc-500">
                      Check digital rental stores below or switch to other regions above to view international availability.
                    </p>
                  </div>
                  {selectedRegion === "IN" && otherRegionsWithStreaming.length > 0 && (
                    <button
                      onClick={() => setSelectedRegion("US")}
                      className="shrink-0 text-xs font-semibold text-purple-400 hover:text-purple-300 underline underline-offset-4"
                    >
                      Check US Platforms ({otherRegionsWithStreaming.length} regions)
                    </button>
                  )}
                </div>
              )}

              {/* Digital Rent & Buy Section */}
              {(rentProviders.length > 0 || buyProviders.length > 0) && (
                <div className="pt-2 border-t border-white/[0.06] space-y-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Rent or Buy Digitally
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {/* Combine unique rent & buy providers */}
                    {Array.from(
                      new Map(
                        [...rentProviders, ...buyProviders].map((p) => [p.provider_id, p])
                      ).values()
                    ).map((provider) => (
                      <div
                        key={provider.provider_id}
                        className="inline-flex items-center gap-2 rounded-lg border border-white/[0.08] bg-zinc-900/50 px-2.5 py-1.5"
                      >
                        {provider.logo_path && (
                          <img
                            src={provider.logo_path}
                            alt={provider.provider_name}
                            className="h-5 w-5 rounded object-cover"
                          />
                        )}
                        <span className="text-xs font-medium text-zinc-300">
                          {provider.provider_name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* JustWatch / Stream Platform Link Button */}
              {justWatchLink && (
                <div className="pt-2 flex items-center justify-between text-xs text-zinc-400">
                  <span className="text-[11px] text-zinc-500">
                    Official streaming metadata provided via JustWatch
                  </span>
                  <a
                    href={justWatchLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-900 px-3 py-1.5 font-semibold text-purple-400 hover:text-purple-300 hover:bg-zinc-800 transition-all border border-purple-500/20"
                  >
                    <span>View All Options on JustWatch</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              )}
            </div>

            {/* TMDB Source Attribution */}
            <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between text-xs text-zinc-400">
              <span>Verified movie metadata provided by The Movie Database (TMDB).</span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  toast.success("Link copied to clipboard!");
                }}
                className="flex items-center gap-1 text-purple-400 hover:text-purple-300 transition-colors"
              >
                <Share2 className="h-3.5 w-3.5" />
                <span>Share Movie</span>
              </button>
            </div>
          </div>
        </div>

        {/* Similar Movies Section */}
        {similarMovies.length > 0 && (
          <div className="mt-16 pt-10 border-t border-white/[0.08] space-y-6">
            <div className="flex items-center gap-2.5">
              <Film className="h-5 w-5 text-purple-400" />
              <h2 className="text-2xl font-bold tracking-tight text-white">
                Similar Cinematic Experiences
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {similarMovies.slice(0, 4).map((sim) => (
                <MovieCard key={sim.id} movie={sim} showAiReason={false} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Trailer Modal */}
      {showTrailerModal && movie.trailerKey && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="relative w-full max-w-4xl aspect-video overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl">
            <button
              onClick={() => setShowTrailerModal(false)}
              className="absolute top-4 right-4 z-10 rounded-full bg-black/70 p-2 text-white hover:bg-black transition-colors"
            >
              ✕
            </button>
            <iframe
              src={`https://www.youtube.com/embed/${movie.trailerKey}?autoplay=1`}
              title={`${movie.title} Trailer`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="h-full w-full border-0"
            />
          </div>
        </div>
      )}
    </div>
  );
}
