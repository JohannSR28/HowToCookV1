import { NextResponse } from "next/server";

export async function POST() {
  // Always return the same dummy Google user
  try {
    const user = {
      id: "google-123",
      name: "Google User",
      email: "user@gmail.com",
      provider: "google",
    };

    return NextResponse.json({ success: true, user });
  } catch {
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
