"use client";

import { useState, useEffect } from "react";
import { Compass, Sparkles, Filter, Search, SlidersHorizontal } from "lucide-react";
import MovieGrid from "@/components/movies/MovieGrid";
import { Movie } from "@/types/movie";
import { GenreType, MoodType } from "@/types/recommendation";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

const GENRES: Array<GenreType | "All"> = [
  "All",
  "Action",
  "Adventure",
  "Comedy",
  "Drama",
  "Horror",
  "Romance",
  "Science Fiction",
  "Thriller",
  "Mystery",
  "Animation",
];

const MOODS: MoodType[] = [
  "Happy",
  "Sad",
  "Excited",
  "Curious",
  "Relaxed",
  "Romantic",
  "Adventurous",
  "Suspenseful",
];

// Initial curated catalogue for Discover page
const DISCOVER_CATALOGUE: Movie[] = [
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
    aiReason: "Epic cosmic journey focusing on human perseverance, love, and time dilation.",
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
    overview: "Cobb, a skilled thief who steals corporate secrets through dream-sharing technology, is given the task of planting an idea.",
    genres: ["Action", "Science Fiction", "Adventure"],
    runtime: 148,
    aiReason: "A labyrinth of dreamscapes, high adrenaline, and profound narrative mystery.",
    matchScore: 97,
  },
  {
    id: 329865,
    title: "Arrival",
    poster_path: "https://image.tmdb.org/t/p/w500/x2FJsf1ElAgr63Y3PNPtJrcmpoe.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/original/yIZ1xendyqKvY3FGeeBEUdOTr9z.jpg",
    release_date: "2016-11-10",
    year: 2016,
    vote_average: 7.6,
    vote_count: 18120,
    overview: "Taking place after alien crafts land around the world, an expert linguist is recruited by the military to determine whether they come in peace.",
    genres: ["Drama", "Science Fiction", "Mystery"],
    runtime: 116,
    aiReason: "Linguistic brilliance and poignant emotional revelations on time and perception.",
    matchScore: 96,
  },
  {
    id: 335984,
    title: "Blade Runner 2049",
    poster_path: "https://image.tmdb.org/t/p/w500/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/original/ilRyazdMJwN05exqhwK4tMKBYZs.jpg",
    release_date: "2017-10-04",
    year: 2017,
    vote_average: 7.6,
    vote_count: 13540,
    overview: "Thirty years after the events of the first film, LAPD Officer K unearths a long-buried secret that has the potential to plunge society into chaos.",
    genres: ["Science Fiction", "Drama"],
    runtime: 164,
    aiReason: "Stunning neon aesthetics and deep existential philosophy in a neo-noir future.",
    matchScore: 95,
  },
  {
    id: 76341,
    title: "Mad Max: Fury Road",
    poster_path: "https://image.tmdb.org/t/p/w500/8tZYtuWezp8JbcsvHYO0O46tFbo.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/original/nl79FQ8xWZkhL3rDr1v2RFFR6J0.jpg",
    release_date: "2015-05-13",
    year: 2015,
    vote_average: 7.6,
    vote_count: 22400,
    overview: "An apocalyptic story set in the furthest reaches of our planet, where humanity is broken and fighting for necessities.",
    genres: ["Action", "Adventure", "Science Fiction"],
    runtime: 120,
    aiReason: "Electrifying post-apocalyptic kinetic energy with unmatched practical stunt mastery.",
    matchScore: 94,
  },
  {
    id: 438631,
    title: "Dune",
    poster_path: "https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94XAgMIckC.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/original/eeijXm355xDqlZvNc3ENCH9z1vS.jpg",
    release_date: "2021-09-15",
    year: 2021,
    vote_average: 7.8,
    vote_count: 12300,
    overview: "Paul Atreides must travel to the most dangerous planet in the universe to ensure the future of his family and his people.",
    genres: ["Science Fiction", "Adventure"],
    runtime: 155,
    aiReason: "Panoramic desert majesty and hypnotic sound design capturing monumental scale.",
    matchScore: 94,
  },
  {
    id: 313369,
    title: "La La Land",
    poster_path: "https://image.tmdb.org/t/p/w500/vQWk5YBFWF4bZaofAbv0tShwBvQ.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/original/nadTlnTE6DdgmYsN2iWZe2V22Aq.jpg",
    release_date: "2016-11-29",
    year: 2016,
    vote_average: 7.9,
    vote_count: 16700,
    overview: "Mia, an aspiring actress, and Sebastian, a dedicated jazz musician, are struggling to make ends meet in modern Los Angeles.",
    genres: ["Comedy", "Drama", "Romance"],
    runtime: 128,
    aiReason: "Radiant Technicolor romance capturing the tender bittersweet nature of pursuing dreams.",
    matchScore: 93,
  },
  {
    id: 546554,
    title: "Knives Out",
    poster_path: "https://image.tmdb.org/t/p/w500/pThyQovXQrw2m0s9x82twj48Jq4.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/original/Ab8mkHmkYADjU7wQiOkia9BzGvS.jpg",
    release_date: "2019-11-27",
    year: 2019,
    vote_average: 7.9,
    vote_count: 12000,
    overview: "When renowned crime novelist Harlan Thrombey is found dead at his estate, Detective Benoit Blanc is mysteriously enlisted to investigate.",
    genres: ["Comedy", "Mystery", "Crime"],
    runtime: 130,
    aiReason: "Gleeful, intricately woven murder mystery filled with wickedly funny revelations.",
    matchScore: 92,
  },
  {
    id: 129,
    title: "Spirited Away",
    poster_path: "https://image.tmdb.org/t/p/w500/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/original/mSDsSDwaP3E7dEfUPWy4J0djt4O.jpg",
    release_date: "2001-07-20",
    year: 2001,
    vote_average: 8.5,
    vote_count: 16500,
    overview: "A young girl, Chihiro, becomes trapped in a strange new world of spirits and must call upon her courage.",
    genres: ["Animation", "Family", "Fantasy"],
    runtime: 125,
    aiReason: "Pure cinematic wonder with breathtaking hand-drawn magic and poignant soul.",
    matchScore: 96,
  },
  {
    id: 244786,
    title: "Whiplash",
    poster_path: "https://image.tmdb.org/t/p/w500/7fn624j5lj3xTme2SgiLCeuedmO.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/original/fRGxZuoL8d7Wz8K3B8VjS9T6f0X.jpg",
    release_date: "2014-10-10",
    year: 2014,
    vote_average: 8.4,
    vote_count: 15300,
    overview: "Under the direction of a ruthless instructor, a talented young drummer begins to pursue perfection at any cost.",
    genres: ["Drama", "Music"],
    runtime: 107,
    aiReason: "Relentless tempo and heart-pounding psychological confrontation.",
    matchScore: 93,
  },
];

export default function DiscoverPage() {
  const [selectedGenre, setSelectedGenre] = useState<GenreType | "All">("All");
  const [selectedMood, setSelectedMood] = useState<MoodType | "All">("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [movies, setMovies] = useState<Movie[]>(DISCOVER_CATALOGUE);
  const [isLoading, setIsLoading] = useState(false);
  const [favouriteIds, setFavouriteIds] = useState<number[]>([]);

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

  // Filter movies based on selected genre, mood, and search query
  const filteredMovies = movies.filter((m) => {
    const matchesGenre =
      selectedGenre === "All" ||
      (Array.isArray(m.genres) &&
        m.genres.some((g) =>
          typeof g === "string"
            ? g.toLowerCase().includes(selectedGenre.toLowerCase())
            : g.name.toLowerCase().includes(selectedGenre.toLowerCase())
        ));

    const matchesSearch =
      !searchQuery.trim() ||
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.overview.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesGenre && matchesSearch;
  });

  const handleAiFilter = async () => {
    if (selectedGenre === "All" && selectedMood === "All" && !searchQuery.trim()) {
      toast("Please pick a genre, mood, or enter a prompt for AI matching.", { icon: "💡" });
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: searchQuery.trim() || `Suggest movies for ${selectedMood} mood in ${selectedGenre} genre.`,
          mood: selectedMood === "All" ? "Curious" : selectedMood,
          genre: selectedGenre === "All" ? undefined : selectedGenre,
        }),
      });

      const data = await res.json();
      if (data.success && Array.isArray(data.data?.recommendations)) {
        setMovies(data.data.recommendations);
        toast.success("AI generated tailored discoveries for you!");
      }
    } catch {
      toast.error("Failed to query AI recommendations.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/[0.08] pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-400">
            <Compass className="h-4 w-4" />
            <span>Curated Film Vault</span>
          </div>
          <h1 className="mt-1 text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Discover Cinema
          </h1>
          <p className="mt-1 text-sm text-zinc-400 max-w-xl">
            Filter through genres, moods, and themes, or tap the AI Recommender to unlock hyper-personalized titles.
          </p>
        </div>

        {/* Quick AI Trigger */}
        <button
          onClick={handleAiFilter}
          disabled={isLoading}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-purple-900/40 hover:opacity-90 transition-opacity"
        >
          <Sparkles className="h-4 w-4 text-yellow-300" />
          <span>{isLoading ? "Searching AI..." : "AI Match for Current Filters"}</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-card rounded-2xl p-5 space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search catalogue by title, theme, director, or keyword..."
            className="w-full rounded-xl border border-white/[0.08] bg-black/40 pl-10 pr-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-500 outline-none focus:border-purple-500 transition-colors"
          />
        </div>

        {/* Genre Pills */}
        <div className="space-y-1.5">
          <span className="text-xs font-semibold text-zinc-400 flex items-center gap-1.5">
            <Filter className="h-3 w-3" />
            <span>Genre Filters:</span>
          </span>
          <div className="flex flex-wrap gap-1.5">
            {GENRES.map((genre) => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-medium border transition-colors",
                  selectedGenre === genre
                    ? "bg-purple-600 border-purple-500 text-white shadow-sm shadow-purple-600/30"
                    : "bg-zinc-900/60 border-white/[0.06] text-zinc-400 hover:text-white hover:bg-zinc-800/60"
                )}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>

        {/* Mood Pills */}
        <div className="space-y-1.5 pt-1">
          <span className="text-xs font-semibold text-zinc-400 flex items-center gap-1.5">
            <SlidersHorizontal className="h-3 w-3" />
            <span>Mood Atmosphere:</span>
          </span>
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setSelectedMood("All")}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium border transition-colors",
                selectedMood === "All"
                  ? "bg-violet-600 border-violet-500 text-white"
                  : "bg-zinc-900/60 border-white/[0.06] text-zinc-400 hover:text-white"
              )}
            >
              All Moods
            </button>
            {MOODS.map((mood) => (
              <button
                key={mood}
                onClick={() => setSelectedMood(mood)}
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-medium border transition-colors",
                  selectedMood === mood
                    ? "bg-violet-600 border-violet-500 text-white"
                    : "bg-zinc-900/60 border-white/[0.06] text-zinc-400 hover:text-white hover:bg-zinc-800/60"
                )}
              >
                {mood}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Movie Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between text-xs text-zinc-400 px-1">
          <span>Showing {filteredMovies.length} cinematic titles</span>
          <span>Verified TMDB Data</span>
        </div>

        <MovieGrid
          movies={filteredMovies}
          isLoading={isLoading}
          favouriteIds={favouriteIds}
          onFavouriteChange={(movieId, isFav) =>
            setFavouriteIds((prev) =>
              isFav ? [...prev, movieId] : prev.filter((id) => id !== movieId)
            )
          }
          emptyTitle="No movies match your filters"
          emptyDescription="Try clearing search keywords or selecting different genres and moods."
        />
      </section>
    </div>
  );
}
