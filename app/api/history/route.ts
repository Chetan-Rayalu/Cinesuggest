import { NextRequest, NextResponse } from "next/server";
import { getSessionUserId, attachSessionCookie } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import Recommendation from "@/models/Recommendation";
import { getMemoryHistory } from "@/lib/session-store";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const userId = await getSessionUserId(request);
    const db = await connectToDatabase();

    if (db) {
      const records = await Recommendation.find({ userId })
        .sort({ createdAt: -1 })
        .limit(30)
        .lean();

      const response = NextResponse.json({
        success: true,
        data: records.map((r) => ({
          id: r._id.toString(),
          prompt: r.prompt,
          mood: r.mood,
          genre: r.genre,
          language: r.language,
          movieType: r.movieType,
          recommendations: r.recommendations,
          createdAt: r.createdAt,
        })),
      });

      return attachSessionCookie(response, userId);
    }

    // Memory fallback
    const records = getMemoryHistory(userId);
    const response = NextResponse.json({
      success: true,
      data: records,
    });

    return attachSessionCookie(response, userId);
  } catch (error) {
    console.error("GET /api/history error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch recommendation history" },
      { status: 500 }
    );
  }
}
