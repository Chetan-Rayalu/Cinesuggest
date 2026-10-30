"use client";

import Link from "next/link";
import { Film, Sparkles, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-white/[0.08] bg-[#09090b] text-zinc-400">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand info */}
          <div className="space-y-4 md:col-span-2">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-violet-800 text-white shadow-md shadow-purple-900/30">
                <Film className="h-4.5 w-4.5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Cine<span className="text-purple-400">Suggest</span>
              </span>
            </Link>
            <p className="max-w-md text-sm leading-relaxed text-zinc-400">
              An intelligent, mood-aware cinema discovery engine powered by Google Gemini and TMDB. Discover your next favourite film through natural conversation and tailored aesthetic tastes.
            </p>
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <span>Crafted with</span>
              <Heart className="h-3.5 w-3.5 fill-red-500 text-red-500" />
              <span>for movie lovers everywhere.</span>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Navigation
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link href="/" className="transition-colors hover:text-purple-400">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/discover" className="transition-colors hover:text-purple-400">
                  AI Discovery
                </Link>
              </li>
              <li>
                <Link href="/favourites" className="transition-colors hover:text-purple-400">
                  Favourites
                </Link>
              </li>
              <li>
                <Link href="/history" className="transition-colors hover:text-purple-400">
                  Recommendation History
                </Link>
              </li>
            </ul>
          </div>

          {/* Attributions & Tech */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Powered By
            </h3>
            <div className="mt-4 space-y-3 text-xs leading-relaxed text-zinc-400">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-purple-400" />
                <span>Google Gemini AI</span>
              </div>
              <p className="text-[11px] text-zinc-400">
                This product uses the TMDB API but is not endorsed or certified by TMDB. Movie metadata, posters and ratings courtesy of The Movie Database.
              </p>
              <div className="pt-2 text-[11px] text-zinc-400">
                Next.js &bull; MongoDB Atlas &bull; Tailwind CSS
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-white/[0.06] pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-400 gap-4">
          <p>&copy; {new Date().getFullYear()} CineSuggest. All movie trademarks belong to their respective copyright holders.</p>
          <div className="flex gap-4">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 px-2.5 py-0.5 text-[11px] font-medium text-purple-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              AI Ready
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
