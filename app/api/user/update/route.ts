import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import bcrypt from "bcryptjs";
import { executeQuery } from "@/lib/supabase";
import { authOptions } from "../../auth/[...nextauth]/route";

export const dynamic = "force-dynamic";

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, email, currentPassword, newPassword } = await req.json();

    // Verify current user
    const users = await executeQuery(
      "SELECT * FROM users WHERE id = $1",
      [session.user.id]
    );
    const user = users[0];

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, user.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Current password is incorrect" },
        { status: 400 }
      );
    }

    // Update user information
    let query = "UPDATE users SET name = $1, email = $2";
    let params = [name, email];

    // If new password is provided, hash and update it
    if (newPassword) {
      const hashedPassword = await bcrypt.hash(newPassword, 12);
      query += ", password = $3";
      params.push(hashedPassword);
    }

    query += " WHERE id = $" + (params.length + 1) + " RETURNING id, name, email";
    params.push(session.user.id);

    const updatedUsers = await executeQuery(query, params);
    const updatedUser = updatedUsers[0];

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
