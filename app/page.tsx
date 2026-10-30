"use client";

import { useState, useEffect } from "react";
import RecommendationForm from "@/components/ai/RecommendationForm";
import RecommendationResults from "@/components/ai/RecommendationResults";
import { Movie } from "@/types/movie";
import { RecommendationRequest } from "@/types/recommendation";
import { Sparkles, Clapperboard, Compass, TrendingUp, ShieldCheck } from "lucide-react";
import Link from "next/link";
import MovieGrid from "@/components/movies/MovieGrid";

// Featured spotlight movies for immediate cinematic immersion on first load
const FEATURED_SPOTLIGHT: Movie[] = [
  {
    id: 157336,
    title: "Interstellar",
    poster_path: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/original/xJHokMbljvjADYdit5fK5VQsXEG.jpg",
    release_date: "2014-11-05",
    year: 2014,
    vote_average: 8.4,
    vote_count: 36042,
    overview: "The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel.",
    genres: ["Adventure", "Drama", "Science Fiction"],
    runtime: 169,
    aiReason: "Regarded as a gold standard for grand cosmic journeys blending emotional human stakes with mind-bending relativity.",
    matchScore: 98,
  },
  {
    id: 27205,
    title: "Inception",
    poster_path: "https://image.tmdb.org/t/p/w500/ljsZTbVsrQSqZgWeep2B1QiDKuh.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/original/8ZTVqvKDQ8emSGUEMjsS4yHAwrp.jpg",
    release_date: "2010-07-15",
    year: 2010,
    vote_average: 8.4,
    vote_count: 37190,
    overview: "Cobb, a skilled thief who steals corporate secrets through use of dream-sharing technology, is given the inverse task of planting an idea into the mind of a CEO.",
    genres: ["Action", "Science Fiction", "Adventure"],
    runtime: 148,
    aiReason: "Exceptional architecture of narrative layers with unforgettable suspense and auditory mastery.",
    matchScore: 96,
  },
  {
    id: 545611,
    title: "Everything Everywhere All at Once",
    poster_path: "https://image.tmdb.org/t/p/w500/7WsyChQLEftFiDOVTGkv3hFpyyt.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/original/ss0Os3uW2Q7v2XvMgy9qm7T5qG9.jpg",
    release_date: "2022-03-24",
    year: 2022,
    vote_average: 7.8,
    vote_count: 6500,
    overview: "An aging Chinese immigrant is swept up in an insane adventure, where she alone can save what's important to her by connecting with other lives.",
    genres: ["Action", "Adventure", "Science Fiction"],
    runtime: 139,
    aiReason: "A kaleidoscope of philosophical absurdity, heartfelt family bonds, and explosive visual creativity.",
    matchScore: 95,
  },
  {
    id: 496243,
    title: "Parasite",
    poster_path: "https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/original/hiKmpZMGZsrkA3cdce8a7Dpos1j.jpg",
    release_date: "2019-05-30",
    year: 2019,
    vote_average: 8.5,
    vote_count: 18500,
    overview: "All unemployed, Ki-taek's family takes peculiar interest in the wealthy and glamorous Parks for their livelihood until they get entangled in an unexpected incident.",
    genres: ["Comedy", "Thriller", "Drama"],
    runtime: 132,
    aiReason: "Masterfully structured tension with pitch-perfect cinematography and unpredictable social satire.",
    matchScore: 94,
  },
  {
    id: 569094,
    title: "Spider-Man: Across the Spider-Verse",
    poster_path: "https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/original/4HodYYKEIsGOdinkGi2Ucz6X9i0.jpg",
    release_date: "2023-05-31",
    year: 2023,
    vote_average: 8.4,
    vote_count: 7300,
    overview: "After reuniting with Gwen Stacy, Brooklyn's full-time Spider-Man is catapulted across the Multiverse.",
    genres: ["Animation", "Action", "Adventure"],
    runtime: 140,
    aiReason: "Pioneering visual artistry combined with breathtaking pacing and heart-wrenching emotional stakes.",
    matchScore: 93,
  },
];

export default function HomePage() {
  const [recommendations, setRecommendations] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeRequest, setActiveRequest] = useState<RecommendationRequest | null>(null);
  const [favouriteIds, setFavouriteIds] = useState<number[]>([]);

  // Fetch current user favourites on mount to sync heart icons
  useEffect(() => {
    fetch("/api/favourites")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setFavouriteIds(data.data.map((item: { movieId: number }) => item.movieId));
        }
      })
      .catch(() => {});
  }, []);

  const handleRecommend = async (req: RecommendationRequest) => {
    setIsLoading(true);
    setError(null);
    setActiveRequest(req);

    try {
      const res = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req),
      });

      const data = await res.json();

      if (data.success && data.data?.recommendations) {
        setRecommendations(data.data.recommendations);
        // Smoothly scroll down to recommendations
        setTimeout(() => {
          document.getElementById("recommendations-section")?.scrollIntoView({
            behavior: "smooth",
          });
        }, 200);
      } else {
        setError(data.error || "Failed to find movie recommendations. Please adjust your criteria.");
      }
    } catch {
      setError("An unexpected network error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFavouriteChange = (movieId: number, isFav: boolean) => {
    setFavouriteIds((prev) =>
      isFav ? [...prev, movieId] : prev.filter((id) => id !== movieId)
    );
  };

  return (
    <div className="relative min-h-screen">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-[600px] w-full max-w-6xl bg-gradient-to-b from-purple-900/20 via-purple-950/5 to-transparent blur-3xl" />

      {/* Hero Section */}
      <section className="relative mx-auto max-w-7xl px-4 pt-12 sm:pt-20 pb-12 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-950/40 px-3.5 py-1 text-xs font-semibold text-purple-300 backdrop-blur-md shadow-lg shadow-purple-950/50">
            <Sparkles className="h-3.5 w-3.5 text-yellow-300 animate-pulse" />
            <span>AI-Driven Cinematic Discovery</span>
            <span className="text-zinc-500">&bull;</span>
            <span className="text-zinc-400">Google Gemini &times; TMDB</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-[1.1]">
            Your Next Favourite Movie <br className="hidden sm:inline" />
            <span className="text-gradient">Starts Here.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg leading-relaxed text-zinc-400 max-w-2xl mx-auto">
            Describe what you want to feel or watch in plain natural language. Our artificial intelligence analyzes narrative themes, moods, and verified TMDB metadata to handcraft 5 immaculate recommendations.
          </p>
        </div>

        {/* AI Form Card */}
        <div className="mt-10 sm:mt-12 max-w-4xl mx-auto">
          <RecommendationForm onSubmit={handleRecommend} isLoading={isLoading} />
        </div>
      </section>

      {/* Recommendations Section */}
      <section id="recommendations-section" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <RecommendationResults
          movies={recommendations}
          isLoading={isLoading}
          error={error}
          prompt={activeRequest?.prompt}
          mood={activeRequest?.mood}
          genre={activeRequest?.genre}
          language={activeRequest?.language}
          onRetry={() => activeRequest && handleRecommend(activeRequest)}
          favouriteIds={favouriteIds}
          onFavouriteChange={handleFavouriteChange}
        />
      </section>

      {/* Featured Cinematic Showcase */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 border-t border-white/[0.08]">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-400">
              <TrendingUp className="h-4 w-4" />
              <span>Trending Masterpieces</span>
            </div>
            <h2 className="mt-1 text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Acclaimed Cinematic Highlights
            </h2>
            <p className="mt-1 text-sm text-zinc-400">
              Discover celebrated films handpicked by our AI curation algorithms.
            </p>
          </div>
          <Link
            href="/discover"
            className="flex items-center gap-1.5 text-sm font-semibold text-purple-400 hover:text-purple-300 transition-colors"
          >
            <span>Explore Discovery Studio</span>
            <Compass className="h-4 w-4" />
          </Link>
        </div>

        <MovieGrid
          movies={FEATURED_SPOTLIGHT}
          favouriteIds={favouriteIds}
          onFavouriteChange={handleFavouriteChange}
          showAiReason={true}
        />
      </section>

      {/* How it Works / Trust Section */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-white/[0.08] bg-zinc-900/40 p-6 backdrop-blur-md space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600/20 text-purple-400">
              <Sparkles className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-white">Semantic Intent Analysis</h3>
            <p className="text-xs leading-relaxed text-zinc-400">
              Google Gemini evaluates emotional resonance, plot pacing, aesthetic tone, and narrative twists rather than simple keyword matching.
            </p>
          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-zinc-900/40 p-6 backdrop-blur-md space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600/20 text-violet-400">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-white">100% TMDB Verified</h3>
            <p className="text-xs leading-relaxed text-zinc-400">
              Every recommended movie is cross-checked against The Movie Database for real ratings, genuine poster art, and accurate release information.
            </p>
          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-zinc-900/40 p-6 backdrop-blur-md space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600/20 text-indigo-400">
              <Clapperboard className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-white">Personalized Library</h3>
            <p className="text-xs leading-relaxed text-zinc-400">
              Save your favourite titles with a single click, revisit your past recommendation history, and uncover hidden cinema gems anytime.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
