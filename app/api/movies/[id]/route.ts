import { NextRequest, NextResponse } from "next/server";
import { getMovieDetails, getSimilarMovies } from "@/lib/tmdb";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const movieId = parseInt(id, 10);

    if (isNaN(movieId)) {
      return NextResponse.json(
        { success: false, error: "Invalid movie ID" },
        { status: 400 }
      );
    }

    const [movie, similarMovies] = await Promise.all([
      getMovieDetails(movieId),
      getSimilarMovies(movieId),
    ]);

    if (!movie) {
      return NextResponse.json(
        { success: false, error: "Movie not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        movie,
        similarMovies,
      },
    });
  } catch (error) {
    console.error("GET /api/movies/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch movie details" },
      { status: 500 }
    );
  }
}
