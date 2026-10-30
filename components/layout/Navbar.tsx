"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Film, Sparkles, Heart, Clock, Compass, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "Home", icon: Film },
  { href: "/discover", label: "Discover", icon: Compass },
  { href: "/favourites", label: "Favourites", icon: Heart },
  { href: "/history", label: "History", icon: Clock },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.08] bg-[#09090b]/80 backdrop-blur-xl transition-all">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link
          href="/"
          className="group flex items-center gap-2.5 transition-transform hover:scale-[1.02]"
        >
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-violet-800 shadow-md shadow-purple-900/40 ring-1 ring-purple-400/30">
            <Film className="h-5 w-5 text-white transition-transform group-hover:rotate-12" />
            <Sparkles className="absolute -top-1 -right-1 h-3.5 w-3.5 text-yellow-300 animate-pulse" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-white group-hover:text-purple-300 transition-colors">
              Cine<span className="text-purple-400">Suggest</span>
            </span>
            <span className="text-[10px] -mt-1 font-medium uppercase tracking-widest text-zinc-400">
              AI Recommender
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1.5 rounded-full border border-white/[0.06] bg-zinc-900/60 p-1.5 backdrop-blur-md">
          {NAV_LINKS.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-purple-600 text-white shadow-lg shadow-purple-600/30"
                    : "text-zinc-400 hover:text-white hover:bg-white/[0.05]"
                )}
              >
                <Icon className={cn("h-4 w-4", isActive ? "text-white" : "text-zinc-400")} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right CTA */}
        <div className="hidden sm:flex items-center gap-3">
          <Link
            href="/discover"
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-purple-900/30 ring-1 ring-white/10 transition-all hover:opacity-90 hover:shadow-purple-700/50 hover:scale-[1.02]"
          >
            <Sparkles className="h-4 w-4" />
            <span>AI Discover</span>
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-white/[0.08] bg-[#09090b]/95 px-4 pt-3 pb-5 backdrop-blur-2xl">
          <div className="flex flex-col gap-2">
            {NAV_LINKS.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
                      : "text-zinc-400 hover:bg-zinc-800/60 hover:text-white"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
            <Link
              href="/discover"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 py-3 text-center text-sm font-semibold text-white shadow-md shadow-purple-900/40"
            >
              <Sparkles className="h-4 w-4" />
              <span>AI Discover</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
