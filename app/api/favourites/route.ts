import { NextRequest, NextResponse } from "next/server";
import { favouriteRequestSchema } from "@/lib/validators";
import { getSessionUserId, attachSessionCookie } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import Favourite from "@/models/Favourite";
import {
  getMemoryFavourites,
  addMemoryFavourite,
} from "@/lib/session-store";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const userId = await getSessionUserId(request);
    const db = await connectToDatabase();

    if (db) {
      const items = await Favourite.find({ userId }).sort({ createdAt: -1 }).lean();
      const response = NextResponse.json({
        success: true,
        data: items.map((item) => ({
          id: item._id.toString(),
          movieId: item.movieId,
          title: item.title,
          posterPath: item.posterPath,
          releaseDate: item.releaseDate,
          rating: item.rating,
          genres: item.genres,
          createdAt: item.createdAt,
        })),
      });
      return attachSessionCookie(response, userId);
    }

    // Memory fallback
    const items = getMemoryFavourites(userId);
    const response = NextResponse.json({
      success: true,
      data: items,
    });
    return attachSessionCookie(response, userId);
  } catch (error) {
    console.error("GET /api/favourites error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch favourites" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = favouriteRequestSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid favourite data",
          details: validation.error.format(),
        },
        { status: 400 }
      );
    }

    const { movieId, title, posterPath, releaseDate, rating, genres } = validation.data;
    const userId = await getSessionUserId(request);
    const db = await connectToDatabase();

    if (db) {
      // Upsert to prevent duplicate favourites
      const fav = await Favourite.findOneAndUpdate(
        { userId, movieId },
        {
          userId,
          movieId,
          title,
          posterPath: posterPath || null,
          releaseDate: releaseDate || "",
          rating: rating || 0,
          genres: genres || [],
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );

      const response = NextResponse.json({
        success: true,
        data: {
          id: fav._id.toString(),
          movieId: fav.movieId,
          title: fav.title,
          posterPath: fav.posterPath,
          releaseDate: fav.releaseDate,
          rating: fav.rating,
          genres: fav.genres,
        },
      });
      return attachSessionCookie(response, userId);
    }

    // Memory fallback
    addMemoryFavourite(userId, {
      userId,
      movieId,
      title,
      posterPath: posterPath || null,
      releaseDate: releaseDate || "",
      rating: rating || 0,
      genres: genres || [],
    });

    const response = NextResponse.json({
      success: true,
      data: { movieId, title, posterPath, releaseDate, rating, genres },
    });
    return attachSessionCookie(response, userId);
  } catch (error) {
    console.error("POST /api/favourites error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save favourite" },
      { status: 500 }
    );
  }
}
