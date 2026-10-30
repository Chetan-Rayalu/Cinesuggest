import { NextRequest, NextResponse } from "next/server";
import { recommendationRequestSchema } from "@/lib/validators";
import { getSessionUserId, attachSessionCookie } from "@/lib/auth";
import { generateMovieRecommendations } from "@/lib/gemini";
import { searchMovieOnTMDB } from "@/lib/tmdb";
import { connectToDatabase } from "@/lib/mongodb";
import Recommendation from "@/models/Recommendation";
import { addMemoryHistory } from "@/lib/session-store";
import { Movie } from "@/types/movie";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = recommendationRequestSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request data",
          details: validation.error.format(),
        },
        { status: 400 }
      );
    }

    const { prompt, mood, genre, language, movieType } = validation.data;
    const userId = await getSessionUserId(request);

    // 1. Generate structured recommendations from Gemini AI
    const aiRecommendations = await generateMovieRecommendations({
      prompt,
      mood,
      genre,
      language,
      movieType,
    });

    if (!aiRecommendations || aiRecommendations.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "No recommendations could be generated for your criteria. Please refine your prompt.",
        },
        { status: 422 }
      );
    }

    // 2. Resolve verified metadata and poster paths from TMDB (source of truth)
    const moviePromises = aiRecommendations.map(async (rec) => {
      try {
        const tmdbMovie = await searchMovieOnTMDB(rec.title, rec.year);
        if (!tmdbMovie) return null;

        const movieWithAi: Movie = {
          ...tmdbMovie,
          aiReason: rec.reason,
          matchScore: rec.matchScore,
        };
        return movieWithAi;
      } catch (e) {
        console.error(`Failed to resolve TMDB metadata for "${rec.title}":`, e);
        return null;
      }
    });

    const resolvedResults = await Promise.all(moviePromises);
    const validMovies: Movie[] = resolvedResults.filter((m): m is Movie => m !== null);

    if (validMovies.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Could not verify recommended movies in TMDB. Please try again with different keywords.",
        },
        { status: 422 }
      );
    }

    // 3. Persist search to MongoDB or fallback memory
    let historyId = "";
    try {
      const db = await connectToDatabase();
      if (db) {
        const saved = await Recommendation.create({
          userId,
          prompt,
          mood,
          genre,
          language,
          movieType,
          recommendations: validMovies,
        });
        historyId = saved._id.toString();
      } else {
        const memSaved = addMemoryHistory(userId, {
          userId,
          prompt,
          mood,
          genre,
          language,
          movieType,
          recommendations: validMovies,
        });
        historyId = memSaved.id || "";
      }
    } catch (dbErr) {
      console.error("Database save warning:", dbErr);
      const memSaved = addMemoryHistory(userId, {
        userId,
        prompt,
        mood,
        genre,
        language,
        movieType,
        recommendations: validMovies,
      });
      historyId = memSaved.id || "";
    }

    const response = NextResponse.json({
      success: true,
      data: {
        id: historyId,
        prompt,
        mood,
        genre,
        language,
        movieType,
        recommendations: validMovies,
      },
    });

    return attachSessionCookie(response, userId);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    console.error("Recommendation API error:", message);
    return NextResponse.json(
      { success: false, error: "Failed to generate recommendations. Please try again." },
      { status: 500 }
    );
  }
}
