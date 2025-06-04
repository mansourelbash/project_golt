import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { executeQuery } from "@/lib/supabase";
import { authOptions } from "../../auth/[...nextauth]/route";

export const dynamic = "force-dynamic";

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    const { notification_preferences, theme, language } = data;

    // Update user settings
    const result = await executeQuery(
      `INSERT INTO user_settings (user_id, notification_preferences, theme, language)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (user_id) 
       DO UPDATE SET 
         notification_preferences = $2,
         theme = $3,
         language = $4,
         updated_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [
        session.user.id,
        notification_preferences,
        theme,
        language
      ]
    );

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("Settings update error:", error);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}
