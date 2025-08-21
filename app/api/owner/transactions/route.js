// app/api/owner/transactions/route.js
import { NextResponse } from "next/server";

const MOCK_TOKEN = "MOCK_OWNER_TOKEN_ABC123";

// A deterministic set of mock transactions
const MOCK_TRANSACTIONS = [
  // id, invoice_no, guest_name, date (ISO), amount, agency_amount, owner_share, owner_percentage, status, notes
  {
    id: 1,
    invoice_no: "INV-1001",
    guest_name: "Alice Brown",
    date: "2025-08-01T10:30:00Z",
    amount: 200.0,
    agency_amount: 160.0,
    owner_share: 40.0,
    owner_percentage: 20,
    status: "paid",
    notes: "",
  },
  {
    id: 2,
    invoice_no: "INV-1002",
    guest_name: "Bob Smith",
    date: "2025-08-02T12:15:00Z",
    amount: 150.0,
    agency_amount: 120.0,
    owner_share: 30.0,
    owner_percentage: 20,
    status: "paid",
    notes: "",
  },
  {
    id: 3,
    invoice_no: "INV-1003",
    guest_name: "Carla Jones",
    date: "2025-08-03T09:00:00Z",
    amount: 350.0,
    agency_amount: 280.0,
    owner_share: 70.0,
    owner_percentage: 20,
    status: "paid",
    notes: "",
  },
  {
    id: 4,
    invoice_no: "INV-1004",
    guest_name: "David Lee",
    date: "2025-07-30T18:00:00Z",
    amount: 100.0,
    agency_amount: 80.0,
    owner_share: 20.0,
    owner_percentage: 20,
    status: "refunded",
    notes: "Refunded by agency",
  },
  {
    id: 5,
    invoice_no: "INV-1005",
    guest_name: "Eve King",
    date: "2025-08-05T14:20:00Z",
    amount: 220.0,
    agency_amount: 176.0,
    owner_share: 44.0,
    owner_percentage: 20,
    status: "paid",
    notes: "",
  },
  {
    id: 6,
    invoice_no: "INV-1006",
    guest_name: "Frank Diaz",
    date: "2025-08-06T08:10:00Z",
    amount: 80.0,
    agency_amount: 64.0,
    owner_share: 16.0,
    owner_percentage: 20,
    status: "due",
    notes: "",
  },
  {
    id: 7,
    invoice_no: "INV-1007",
    guest_name: "Grace Hall",
    date: "2025-07-28T20:30:00Z",
    amount: 500.0,
    agency_amount: 375.0,
    owner_share: 125.0,
    owner_percentage: 25,
    status: "paid",
    notes: "Special rate - 25% owner",
  },
  {
    id: 8,
    invoice_no: "INV-1008",
    guest_name: "Hassan Yusuf",
    date: "2025-08-07T07:45:00Z",
    amount: 60.0,
    agency_amount: 48.0,
    owner_share: 12.0,
    owner_percentage: 20,
    status: "paid",
    notes: "",
  },
  {
    id: 9,
    invoice_no: "INV-1009",
    guest_name: "Ivy Nguyen",
    date: "2025-08-08T11:00:00Z",
    amount: 300.0,
    agency_amount: 240.0,
    owner_share: 60.0,
    owner_percentage: 20,
    status: "paid",
    notes: "",
  },
  {
    id: 10,
    invoice_no: "INV-1010",
    guest_name: "John Paul",
    date: "2025-08-09T16:00:00Z",
    amount: 120.0,
    agency_amount: 96.0,
    owner_share: 24.0,
    owner_percentage: 20,
    status: "paid",
    notes: "",
  },
  {
    id: 11,
    invoice_no: "INV-1011",
    guest_name: "Kathy Z.",
    date: "2025-08-10T13:30:00Z",
    amount: 420.0,
    agency_amount: 336.0,
    owner_share: 84.0,
    owner_percentage: 20,
    status: "due",
    notes: "",
  },
  {
    id: 12,
    invoice_no: "INV-1012",
    guest_name: "Leo Messi",
    date: "2025-08-11T09:20:00Z",
    amount: 260.0,
    agency_amount: 208.0,
    owner_share: 52.0,
    owner_percentage: 20,
    status: "paid",
    notes: "",
  },
  {
    id: 13,
    invoice_no: "INV-1013",
    guest_name: "Maya Angel",
    date: "2025-08-12T15:40:00Z",
    amount: 180.0,
    agency_amount: 144.0,
    owner_share: 36.0,
    owner_percentage: 20,
    status: "paid",
    notes: "",
  },
  {
    id: 14,
    invoice_no: "INV-1014",
    guest_name: "Nate Wright",
    date: "2025-08-13T19:00:00Z",
    amount: 90.0,
    agency_amount: 72.0,
    owner_share: 18.0,
    owner_percentage: 20,
    status: "paid",
    notes: "",
  },
  {
    id: 15,
    invoice_no: "INV-1015",
    guest_name: "Olivia Q",
    date: "2025-08-14T21:10:00Z",
    amount: 270.0,
    agency_amount: 216.0,
    owner_share: 54.0,
    owner_percentage: 20,
    status: "paid",
    notes: "",
  },
];

export async function GET(request) {
  const auth = request.headers.get("authorization") || "";
  const token = auth.replace(/^Bearer\s+/i, "");
  if (!token || token !== MOCK_TOKEN) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // parse query params
  const url = new URL(request.url);
  const q =
    url.searchParams.get("q") ||
    url.searchParams.get("q") ||
    url.searchParams.get("q");
  const status = (url.searchParams.get("status") || "").toLowerCase();
  const page = Math.max(1, Number(url.searchParams.get("page") || 1));
  const per_page = Math.max(1, Number(url.searchParams.get("per_page") || 12));
  const start_date = url.searchParams.get("start_date");
  const end_date = url.searchParams.get("end_date");

  // filter data
  let rows = MOCK_TRANSACTIONS.slice();

  if (q) {
    const qq = q.toLowerCase();
    rows = rows.filter(
      (r) =>
        (r.invoice_no || "").toLowerCase().includes(qq) ||
        (r.guest_name || "").toLowerCase().includes(qq)
    );
  }
  if (status && status !== "all") {
    rows = rows.filter((r) => (r.status || "").toLowerCase() === status);
  }
  if (start_date) {
    const s = new Date(start_date);
    rows = rows.filter((r) => new Date(r.date) >= s);
  }
  if (end_date) {
    const e = new Date(end_date);
    rows = rows.filter((r) => new Date(r.date) <= e);
  }

  const total = rows.length;
  const start = (page - 1) * per_page;
  const paged = rows.slice(start, start + per_page);

  return NextResponse.json({
    data: paged,
    meta: { total, page, per_page },
  });
}
