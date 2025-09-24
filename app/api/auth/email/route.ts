import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    // Ignore validation, just return dummy user
    const user = {
      id: "email-456",
      name: "Email User",
      email,
      provider: "email",
    };

    return NextResponse.json({ success: true, user });
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request" },
      { status: 400 }
    );
  }
}
