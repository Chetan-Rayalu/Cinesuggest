"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Clock, Trash2, Sparkles, ArrowRight, Calendar, Compass, ExternalLink } from "lucide-react";
import { RecommendationHistoryItem } from "@/types/recommendation";
import { getTMDBPosterUrl } from "@/lib/tmdb";
import toast from "react-hot-toast";

export default function HistoryPage() {
  const [history, setHistory] = useState<RecommendationHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/history");
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setHistory(data.data);
      }
    } catch {
      toast.error("Failed to load recommendation history.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/history/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setHistory((prev) => prev.filter((item) => (item.id || item._id) !== id));
        toast.success("History session deleted.", {
          style: { background: "#18181b", color: "#fff", border: "1px solid #3f3f46" },
        });
      }
    } catch {
      toast.error("Failed to delete history item.");
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/[0.08] pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-400">
            <Clock className="h-4 w-4" />
            <span>Search Trajectory</span>
          </div>
          <h1 className="mt-1 text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Recommendation History
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            Review and revisit past AI queries and movie recommendation sets.
          </p>
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl bg-purple-600/20 border border-purple-500/30 px-4 py-2 text-xs font-semibold text-purple-300 hover:bg-purple-600/30 transition-colors"
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>New Recommendation</span>
        </Link>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="space-y-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-48 w-full rounded-2xl bg-zinc-900/60 border border-white/[0.06] animate-pulse"
            />
          ))}
        </div>
      ) : history.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 bg-zinc-900/20 px-6 py-20 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-950/30 border border-purple-500/20 text-purple-400 mb-4">
            <Clock className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-bold text-white">No history entries yet</h2>
          <p className="mt-2 max-w-sm text-sm text-zinc-400">
            When you search for movie recommendations, CineSuggest logs your prompts and suggestions here so you never lose a great title.
          </p>
          <Link
            href="/"
            className="mt-6 flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-900/40 hover:opacity-90 transition-opacity"
          >
            <span>Start Your First Search</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {history.map((item) => {
            const historyId = item.id || item._id || "";
            const formattedDate = item.createdAt
              ? new Date(item.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "Recently";

            return (
              <div
                key={historyId}
                className="glass-card rounded-2xl p-6 border border-white/[0.08] space-y-4 transition-all hover:border-purple-500/30"
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/[0.06] pb-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="flex items-center gap-1.5 text-xs text-zinc-400">
                      <Calendar className="h-3.5 w-3.5 text-purple-400" />
                      <span>{formattedDate}</span>
                    </span>
                    <span className="text-zinc-600">&bull;</span>
                    {item.mood && (
                      <span className="rounded-md border border-purple-500/30 bg-purple-950/40 px-2 py-0.5 text-[11px] font-medium text-purple-300">
                        Mood: {item.mood}
                      </span>
                    )}
                    {item.genre && (
                      <span className="rounded-md border border-white/10 bg-zinc-900 px-2 py-0.5 text-[11px] font-medium text-zinc-300">
                        Genre: {item.genre}
                      </span>
                    )}
                    {item.language && (
                      <span className="rounded-md border border-white/10 bg-zinc-900 px-2 py-0.5 text-[11px] font-medium text-zinc-300">
                        {item.language}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => handleDelete(historyId)}
                    title="Delete session"
                    className="self-end sm:self-auto flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs text-zinc-400 hover:bg-red-950/50 hover:text-red-300 transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Delete</span>
                  </button>
                </div>

                {/* Prompt */}
                <div>
                  <h3 className="text-sm font-semibold text-white">Prompt:</h3>
                  <p className="mt-1 text-sm italic text-zinc-300">
                    &ldquo;{item.prompt}&rdquo;
                  </p>
                </div>

                {/* Recommended Movies Row */}
                {Array.isArray(item.recommendations) && item.recommendations.length > 0 && (
                  <div className="pt-2">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3">
                      Recommended Titles:
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                      {item.recommendations.map((movie) => (
                        <Link
                          key={movie.id}
                          href={`/movies/${movie.id}`}
                          className="group relative flex flex-col rounded-xl overflow-hidden border border-white/[0.08] bg-zinc-950 hover:border-purple-500/50 transition-all"
                        >
                          <div className="relative aspect-[2/3] w-full">
                            <Image
                              src={getTMDBPosterUrl(movie.poster_path, "w342")}
                              alt={movie.title}
                              fill
                              unoptimized
                              className="object-cover group-hover:scale-105 transition-transform"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                          </div>
                          <div className="p-2 bg-zinc-900/90">
                            <span className="block text-xs font-semibold text-white group-hover:text-purple-300 line-clamp-1 transition-colors">
                              {movie.title}
                            </span>
                            {movie.year && (
                              <span className="text-[10px] text-zinc-400">
                                {movie.year}
                              </span>
                            )}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
