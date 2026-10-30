"use client";

import { GenreType } from "@/types/recommendation";
import { cn } from "@/lib/utils";

interface GenreSelectorProps {
  selectedGenre: GenreType | "All";
  onChange: (genre: GenreType | "All") => void;
}

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

export default function GenreSelector({ selectedGenre, onChange }: GenreSelectorProps) {
  return (
    <div className="space-y-2.5">
      <label className="text-sm font-semibold tracking-wide text-zinc-300 flex items-center gap-2">
        <span>Preferred Genre</span>
        <span className="text-xs text-purple-400 font-normal">(Pick primary category)</span>
      </label>
      <div className="flex flex-wrap gap-2">
        {GENRES.map((genre) => {
          const isSelected = selectedGenre === genre;
          return (
            <button
              key={genre}
              type="button"
              onClick={() => onChange(genre)}
              className={cn(
                "rounded-full px-3.5 py-1.5 text-xs font-medium transition-all duration-150 border",
                isSelected
                  ? "bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-600/30 ring-1 ring-purple-400"
                  : "bg-zinc-900/60 border-white/[0.08] text-zinc-400 hover:border-zinc-700 hover:text-white hover:bg-zinc-800/50"
              )}
            >
              {genre}
            </button>
          );
        })}
      </div>
    </div>
  );
}
