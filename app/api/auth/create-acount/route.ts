import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password } = body;

    // Here, you would normally interact with your database to create the user.
    const newUser = {
      id: "newuser-789",
      name: name || "New User",
      email,
      provider: "email",
    };

    return NextResponse.json({ success: true, user: newUser });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to create account" },
      { status: 500 }
    );
  }
}
