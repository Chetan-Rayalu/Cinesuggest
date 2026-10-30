"use client";

import { useState } from "react";
import { Sparkles, ArrowRight, Wand2, Lightbulb } from "lucide-react";
import MoodSelector from "./MoodSelector";
import GenreSelector from "./GenreSelector";
import LanguageSelector from "./LanguageSelector";
import {
  MoodType,
  GenreType,
  LanguageType,
  MovieCategoryType,
  RecommendationRequest,
} from "@/types/recommendation";
import { cn } from "@/lib/utils";

interface RecommendationFormProps {
  onSubmit: (request: RecommendationRequest) => void;
  isLoading: boolean;
}

const SAMPLE_PROMPTS = [
  "I want a mind-bending science fiction movie with an unexpected ending, something similar to Interstellar.",
  "Show me an intense neo-noir detective thriller with a rain-soaked aesthetic.",
  "A heartwarming, visually breathtaking animated film for a cozy evening.",
  "Electrifying high-stakes crime heist that will keep me on the edge of my seat.",
];

export default function RecommendationForm({ onSubmit, isLoading }: RecommendationFormProps) {
  const [prompt, setPrompt] = useState("");
  const [mood, setMood] = useState<MoodType>("Curious");
  const [genre, setGenre] = useState<GenreType | "All">("All");
  const [language, setLanguage] = useState<LanguageType>("English");
  const [movieType, setMovieType] = useState<MovieCategoryType>("Movies");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() && genre === "All") {
      setPrompt("Recommend 5 acclaimed must-watch movies matching my mood and preferences.");
      onSubmit({
        prompt: "Recommend 5 acclaimed must-watch movies matching my mood and preferences.",
        mood,
        genre: genre === "All" ? undefined : genre,
        language,
        movieType,
      });
      return;
    }

    onSubmit({
      prompt: prompt.trim() || `Great movies matching mood: ${mood} and genre: ${genre}`,
      mood,
      genre: genre === "All" ? undefined : genre,
      language,
      movieType,
    });
  };

  const handleSampleClick = (sample: string) => {
    setPrompt(sample);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="glass-panel relative overflow-hidden rounded-3xl p-6 sm:p-8 shadow-2xl shadow-purple-950/20"
    >
      {/* Decorative ambient gradient backdrop */}
      <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-purple-600/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-violet-600/10 blur-3xl" />

      <div className="relative space-y-6">
        {/* Main Search Input */}
        <div className="space-y-2.5">
          <label htmlFor="ai-prompt" className="text-sm font-semibold tracking-wide text-zinc-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-purple-400" />
              <span>Describe what kind of movie you want to watch</span>
            </div>
            <span className="text-xs text-zinc-400">Natural Language Prompt</span>
          </label>

          <div className="relative">
            <textarea
              id="ai-prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. I want a mind-bending science fiction movie with an unexpected ending, something similar to Interstellar..."
              rows={3}
              className="w-full resize-none rounded-2xl border border-white/[0.1] bg-black/40 p-4 text-sm text-zinc-100 placeholder:text-zinc-500 backdrop-blur-md outline-none transition-all focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
            />
          </div>

          {/* Prompt inspiration pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none">
            <div className="flex items-center gap-1 text-[11px] font-medium text-zinc-400 shrink-0">
              <Lightbulb className="h-3.5 w-3.5 text-yellow-400" />
              <span>Try:</span>
            </div>
            {SAMPLE_PROMPTS.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSampleClick(sample)}
                className="shrink-0 rounded-full border border-white/[0.06] bg-zinc-900/60 px-3 py-1 text-[11px] text-zinc-400 hover:border-purple-500/40 hover:text-purple-300 hover:bg-purple-950/30 transition-colors"
              >
                &ldquo;{sample.slice(0, 38)}...&rdquo;
              </button>
            ))}
          </div>
        </div>

        {/* Mood Selector */}
        <div className="pt-2">
          <MoodSelector selectedMood={mood} onChange={setMood} />
        </div>

        {/* Genre Selector */}
        <div className="pt-2">
          <GenreSelector selectedGenre={genre} onChange={setGenre} />
        </div>

        {/* Language and Movie Type */}
        <div className="pt-2">
          <LanguageSelector
            selectedLanguage={language}
            selectedMovieType={movieType}
            onLanguageChange={setLanguage}
            onMovieTypeChange={setMovieType}
          />
        </div>

        {/* Action Button */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/[0.06]">
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
            <span>Gemini AI + TMDB live verification enabled</span>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={cn(
              "group relative flex w-full sm:w-auto items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 px-8 py-3.5 text-sm font-bold text-white shadow-xl shadow-purple-900/40 ring-1 ring-white/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-purple-600/50 active:scale-[0.98]",
              isLoading && "opacity-80 cursor-not-allowed"
            )}
          >
            {isLoading ? (
              <>
                <Wand2 className="h-4 w-4 animate-spin text-purple-200" />
                <span>Crafting Recommendations...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 text-yellow-300" />
                <span>Generate Recommendations</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
