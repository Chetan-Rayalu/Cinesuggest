import { getMovieDetails, getSimilarMovies } from "@/lib/tmdb";
import MovieDetails from "@/components/movies/MovieDetails";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface MoviePageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: MoviePageProps): Promise<Metadata> {
  const { id } = await params;
  const numId = parseInt(id, 10);
  if (isNaN(numId)) return { title: "Movie Details - CineSuggest" };

  const movie = await getMovieDetails(numId);
  if (!movie) return { title: "Movie Not Found - CineSuggest" };

  return {
    title: `${movie.title} (${movie.year || "Film"}) - CineSuggest`,
    description: movie.overview.slice(0, 160),
    openGraph: {
      title: `${movie.title} - CineSuggest AI`,
      description: movie.overview,
      images: movie.poster_path ? [movie.poster_path] : [],
    },
  };
}

export default async function MoviePage({ params }: MoviePageProps) {
  const { id } = await params;
  const numId = parseInt(id, 10);

  if (isNaN(numId)) {
    notFound();
  }

  const [movie, similarMovies] = await Promise.all([
    getMovieDetails(numId),
    getSimilarMovies(numId),
  ]);

  if (!movie) {
    notFound();
  }

  return <MovieDetails movie={movie} similarMovies={similarMovies} />;
}
