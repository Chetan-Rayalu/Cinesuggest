"use client";

import { LanguageType, MovieCategoryType } from "@/types/recommendation";
import { cn } from "@/lib/utils";
import { Globe, Film } from "lucide-react";

interface LanguageSelectorProps {
  selectedLanguage: LanguageType;
  selectedMovieType: MovieCategoryType;
  onLanguageChange: (lang: LanguageType) => void;
  onMovieTypeChange: (type: MovieCategoryType) => void;
}

const LANGUAGES: LanguageType[] = [
  "English",
  "Telugu",
  "Hindi",
  "Tamil",
  "Malayalam",
  "Kannada",
  "Japanese",
  "Korean",
];

const MOVIE_TYPES: MovieCategoryType[] = ["Movies", "Animated movies", "Any"];

export default function LanguageSelector({
  selectedLanguage,
  selectedMovieType,
  onLanguageChange,
  onMovieTypeChange,
}: LanguageSelectorProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* Language */}
      <div className="space-y-2">
        <label className="text-sm font-semibold tracking-wide text-zinc-300 flex items-center gap-2">
          <Globe className="h-4 w-4 text-purple-400" />
          <span>Language Preference</span>
        </label>
        <select
          value={selectedLanguage}
          onChange={(e) => onLanguageChange(e.target.value as LanguageType)}
          aria-label="Language Preference"
          className="w-full rounded-xl border border-white/[0.1] bg-zinc-900/80 px-3.5 py-2.5 text-sm text-zinc-200 outline-none transition-colors focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
        >
          {LANGUAGES.map((lang) => (
            <option key={lang} value={lang} className="bg-zinc-900 text-zinc-200">
              {lang}
            </option>
          ))}
        </select>
      </div>

      {/* Movie Type */}
      <div className="space-y-2">
        <label className="text-sm font-semibold tracking-wide text-zinc-300 flex items-center gap-2">
          <Film className="h-4 w-4 text-purple-400" />
          <span>Format / Type</span>
        </label>
        <div className="flex gap-2">
          {MOVIE_TYPES.map((type) => {
            const isSelected = selectedMovieType === type;
            return (
              <button
                key={type}
                type="button"
                onClick={() => onMovieTypeChange(type)}
                className={cn(
                  "flex-1 rounded-xl py-2 px-3 text-xs font-medium border transition-all text-center",
                  isSelected
                    ? "bg-purple-600 border-purple-500 text-white shadow-md shadow-purple-600/30"
                    : "bg-zinc-900/60 border-white/[0.08] text-zinc-400 hover:text-white hover:bg-zinc-800/60"
                )}
              >
                {type}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
