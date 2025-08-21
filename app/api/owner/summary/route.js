// app/api/owner/summary/route.js
import { NextResponse } from "next/server";

const MOCK_TOKEN = "MOCK_OWNER_TOKEN_ABC123";
const SUM_DATA = {
  total_revenue: 3900.0,
  total_received: 3700.0,
  total_due: 200.0,
  upcoming_invoices_count: 2,
};

export async function GET(request) {
  const auth = request.headers.get("authorization") || "";
  const token = auth.replace(/^Bearer\s+/i, "");
  if (!token || token !== MOCK_TOKEN) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json(SUM_DATA);
}
