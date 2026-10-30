import { NextRequest, NextResponse } from "next/server";
import { getSessionUserId, attachSessionCookie } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import Favourite from "@/models/Favourite";
import { removeMemoryFavourite } from "@/lib/session-store";

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ movieId: string }> }
) {
  try {
    const { movieId } = await context.params;
    const numId = parseInt(movieId, 10);

    if (isNaN(numId)) {
      return NextResponse.json(
        { success: false, error: "Invalid movie ID" },
        { status: 400 }
      );
    }

    const userId = await getSessionUserId(request);
    const db = await connectToDatabase();

    if (db) {
      await Favourite.findOneAndDelete({ userId, movieId: numId });
    } else {
      removeMemoryFavourite(userId, numId);
    }

    const response = NextResponse.json({
      success: true,
      message: "Removed from favourites",
    });

    return attachSessionCookie(response, userId);
  } catch (error) {
    console.error("DELETE /api/favourites/[movieId] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to remove favourite" },
      { status: 500 }
    );
  }
}
