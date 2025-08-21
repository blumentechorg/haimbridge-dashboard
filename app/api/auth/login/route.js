// app/api/auth/login/route.js
import { NextResponse } from "next/server";

const MOCK_TOKEN = "MOCK_OWNER_TOKEN_ABC123";
const VALID_USER = {
  id: "owner-1",
  name: "Building Owner",
  email: "owner@example.com",
  role: "owner",
};

// Simple credentials: owner@example.com / ownerpass
export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body || {};

    if (!email || !password) {
      return NextResponse.json(
        { message: "Missing email or password" },
        { status: 400 }
      );
    }

    // Accept one test credential only for now
    if (email === "owner@example.com" && password === "ownerpass") {
      // Return token and user info (client will save token)
      return NextResponse.json({ token: MOCK_TOKEN, user: VALID_USER });
    }

    return NextResponse.json(
      { message: "Invalid credentials" },
      { status: 401 }
    );
  } catch (err) {
    return NextResponse.json(
      { message: "Bad request", error: String(err) },
      { status: 400 }
    );
  }
}
