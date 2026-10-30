"use client";

import { MoodType } from "@/types/recommendation";
import { cn } from "@/lib/utils";
import {
  Smile,
  Frown,
  Zap,
  HelpCircle,
  Coffee,
  Heart,
  Compass,
  Flame,
} from "lucide-react";

interface MoodSelectorProps {
  selectedMood: MoodType;
  onChange: (mood: MoodType) => void;
}

const MOODS: Array<{ label: MoodType; icon: React.ComponentType<{ className?: string }>; emoji: string }> = [
  { label: "Happy", icon: Smile, emoji: "😊" },
  { label: "Sad", icon: Frown, emoji: "🥺" },
  { label: "Excited", icon: Zap, emoji: "⚡" },
  { label: "Curious", icon: HelpCircle, emoji: "🧐" },
  { label: "Relaxed", icon: Coffee, emoji: "☕" },
  { label: "Romantic", icon: Heart, emoji: "💖" },
  { label: "Adventurous", icon: Compass, emoji: "🗺️" },
  { label: "Suspenseful", icon: Flame, emoji: "🔥" },
];

export default function MoodSelector({ selectedMood, onChange }: MoodSelectorProps) {
  return (
    <div className="space-y-2.5">
      <label className="text-sm font-semibold tracking-wide text-zinc-300 flex items-center gap-2">
        <span>How are you feeling today?</span>
        <span className="text-xs text-purple-400 font-normal">(Mood)</span>
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {MOODS.map((item) => {
          const isSelected = selectedMood === item.label;
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              type="button"
              onClick={() => onChange(item.label)}
              className={cn(
                "group flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-medium transition-all duration-200 border",
                isSelected
                  ? "bg-purple-600/20 border-purple-500 text-white shadow-md shadow-purple-500/20 ring-1 ring-purple-500"
                  : "bg-zinc-900/50 border-white/[0.08] text-zinc-400 hover:border-zinc-700 hover:bg-zinc-800/60 hover:text-white"
              )}
            >
              <div className="flex items-center gap-2">
                <Icon
                  className={cn(
                    "h-4 w-4 transition-transform group-hover:scale-110",
                    isSelected ? "text-purple-400" : "text-zinc-400"
                  )}
                />
                <span>{item.label}</span>
              </div>
              <span className="text-sm">{item.emoji}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
