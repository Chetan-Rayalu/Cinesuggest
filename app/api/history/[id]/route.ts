import { NextRequest, NextResponse } from "next/server";
import { getSessionUserId, attachSessionCookie } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import Recommendation from "@/models/Recommendation";
import { removeMemoryHistory } from "@/lib/session-store";

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    if (!id) {
      return NextResponse.json(
        { success: false, error: "History ID is required" },
        { status: 400 }
      );
    }

    const userId = await getSessionUserId(request);
    const db = await connectToDatabase();

    if (db) {
      // Validate ownership before deleting
      await Recommendation.findOneAndDelete({ _id: id, userId });
    } else {
      removeMemoryHistory(userId, id);
    }

    const response = NextResponse.json({
      success: true,
      message: "History entry removed",
    });

    return attachSessionCookie(response, userId);
  } catch (error) {
    console.error("DELETE /api/history/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete history item" },
      { status: 500 }
    );
  }
}
