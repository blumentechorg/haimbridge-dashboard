// lib/api.js
// Mock API wrapper — returns mock data for /auth/login, /owner/profile, /owner/transactions, /owner/summary
// This is client-side only and intended for development/demo. It mimics the same api.get/post interface used by the app.

const MOCK_TOKEN = "MOCK_OWNER_TOKEN_ABC123";

const MOCK_PROFILE = {
  id: "owner-1",
  name: "Building Owner",
  email: "owner@example.com",
  company: "Sunrise Properties Ltd.",
  owner_percentage: 20, // default percent (20)
};

const MOCK_TRANSACTIONS = [
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

const MOCK_SUMMARY = {
  total_revenue: MOCK_TRANSACTIONS.reduce((s, r) => s + (r.amount || 0), 0),
  total_received: MOCK_TRANSACTIONS.filter((t) => t.status === "paid").reduce(
    (s, r) => s + (r.amount || 0),
    0
  ),
  total_due: MOCK_TRANSACTIONS.filter((t) => t.status === "due").reduce(
    (s, r) => s + (r.amount || 0),
    0
  ),
  upcoming_invoices_count: 2,
};

// helpers
function sleep(ms = 250) {
  return new Promise((res) => setTimeout(res, ms));
}

function getTokenFromCookie() {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(/(?:^|; )owner_token=([^;]+)/);
  return m ? decodeURIComponent(m[1]) : null;
}

function buildQuery(params = {}) {
  const esc = encodeURIComponent;
  const pairs = Object.keys(params)
    .filter(
      (k) => params[k] !== undefined && params[k] !== null && params[k] !== ""
    )
    .map((k) => `${esc(k)}=${esc(params[k])}`);
  return pairs.length ? `?${pairs.join("&")}` : "";
}

// exported API interface
export default {
  async post(path, body = {}, opts = {}) {
    await sleep(200);

    const trimmed = path.replace(/^\/+/, "");
    if (trimmed === "auth/login" || trimmed === "/auth/login") {
      const { email, password } = body || {};
      if (email === "owner@example.com" && password === "ownerpass") {
        return { token: MOCK_TOKEN, user: MOCK_PROFILE };
      }
      const err = new Error("Invalid credentials");
      err.status = 401;
      throw err;
    }

    // For other POSTs, return not implemented
    const e = new Error(`POST ${path} not implemented in mock`);
    e.status = 404;
    throw e;
  },

  async get(path, opts = {}) {
    await sleep(150);

    const token = getTokenFromCookie();
    // allow requests to pass only if token matches mock token
    const authRequired = [
      "/owner/profile",
      "/owner/transactions",
      "/owner/summary",
    ];
    const trimmed = path.replace(/^\/+/, "").split("?")[0];

    if (
      authRequired.includes(`/${trimmed}`) ||
      authRequired.includes(trimmed)
    ) {
      if (!token || token !== MOCK_TOKEN) {
        const err = new Error("Unauthorized");
        err.status = 401;
        throw err;
      }
    }

    // /owner/profile
    if (trimmed === "owner/profile" || trimmed === "/owner/profile") {
      return { ...MOCK_PROFILE };
    }

    // /owner/summary
    if (trimmed === "owner/summary" || trimmed === "/owner/summary") {
      return { ...MOCK_SUMMARY };
    }

    // /owner/transactions (support opts.params)
    if (trimmed === "owner/transactions" || trimmed === "/owner/transactions") {
      // accept params via opts.params or via path query string
      const params = (opts && opts.params) || {};
      // default pagination
      const page = Math.max(1, Number(params.page || 1));
      const per_page = Math.max(
        1,
        Number(params.per_page || params.per_page || 12)
      );
      const q = (params.q || params.q || "").toString().trim();
      const status = (params.status || "").toLowerCase();
      const start_date = params.start_date;
      const end_date = params.end_date;

      // filtering
      let rows = MOCK_TRANSACTIONS.slice();

      if (q) {
        const qq = q.toLowerCase();
        rows = rows.filter(
          (r) =>
            (r.invoice_no || "").toLowerCase().includes(qq) ||
            (r.guest_name || "").toLowerCase().includes(qq) ||
            String(r.id || "").includes(qq)
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

      return {
        data: paged,
        meta: { total, page, per_page },
      };
    }

    const e = new Error(`GET ${path} not implemented in mock`);
    e.status = 404;
    throw e;
  },

  async put(path, body = {}, opts = {}) {
    await sleep(80);
    const e = new Error(`PUT ${path} not implemented in mock`);
    e.status = 404;
    throw e;
  },

  async delete(path, opts = {}) {
    await sleep(80);
    const e = new Error(`DELETE ${path} not implemented in mock`);
    e.status = 404;
    throw e;
  },
};
