import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CineSuggest – AI Movie Recommender",
  description:
    "Discover your next favourite movie powered by Google Gemini AI and TMDB. Personalized cinematic recommendations based on your mood, genres, and natural-language prompts.",
  keywords: [
    "AI movie recommender",
    "movie discovery",
    "Gemini AI",
    "TMDB",
    "cinema suggestions",
    "mood based movies",
  ],
  authors: [{ name: "CineSuggest Team" }],
  openGraph: {
    title: "CineSuggest – AI Movie Recommender",
    description: "Your Next Favourite Movie Starts Here. AI-driven cinema discovery.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#09090b] text-[#f4f4f5] selection:bg-purple-600 selection:text-white">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 3500,
            style: {
              background: "#121118",
              color: "#f4f4f5",
              border: "1px solid rgba(139, 92, 246, 0.3)",
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.5)",
              fontSize: "13px",
            },
          }}
        />
      </body>
    </html>
  );
}
