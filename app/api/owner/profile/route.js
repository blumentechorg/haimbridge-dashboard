// app/api/owner/profile/route.js
import { NextResponse } from "next/server";

const MOCK_TOKEN = "MOCK_OWNER_TOKEN_ABC123";

export async function GET(request) {
  const auth = request.headers.get("authorization") || "";
  const token = auth.replace(/^Bearer\s+/i, "");

  if (!token || token !== MOCK_TOKEN) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // Mock profile payload
  const profile = {
    id: "owner-1",
    name: "Building Owner",
    email: "owner@example.com",
    company: "Sunrise Properties Ltd.",
    owner_percentage: 20, // default percent (20%)
  };

  return NextResponse.json(profile);
}
