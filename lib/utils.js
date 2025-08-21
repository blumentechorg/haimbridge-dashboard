// lib/utils.js
/**
 * Utility helpers for transaction calculations and formatting
 */

/**
 * formatCurrency - simple currency formatter (USD by default)
 * @param {number|string} v
 * @returns {string}
 */
export function formatCurrency(v) {
  const n = Number(v ?? 0);
  if (Number.isNaN(n)) return "$0.00";
  return n.toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });
}

/**
 * calculateOwnerShare - returns expected owner share numeric (not formatted)
 * Logic:
 *  - prefer explicit owner_percentage on transaction (0..1 or 0..100)
 *  - otherwise use NEXT_PUBLIC_OWNER_PERCENTAGE env var (0..1 or 0..100)
 *  - fallback to 0.2 (20%)
 *
 * Accepts tx with fields: amount, owner_percentage
 */
export function calculateOwnerShare(tx) {
  const amount = Number(tx?.amount ?? 0);
  if (!amount) return 0;
  let pct = undefined;

  if (tx && tx.owner_percentage !== undefined && tx.owner_percentage !== null) {
    pct = Number(tx.owner_percentage);
  } else if (
    typeof process !== "undefined" &&
    process?.env?.NEXT_PUBLIC_OWNER_PERCENTAGE
  ) {
    pct = Number(process.env.NEXT_PUBLIC_OWNER_PERCENTAGE);
  }

  if (Number.isNaN(pct) || pct === undefined || pct === null) {
    pct = 0.2; // default 20%
  }

  // robust handling: if owner_percentage looks like 20 or 0.2
  if (pct > 1) pct = pct / 100;

  const expected = Math.round(amount * pct * 100) / 100; // round to cents
  return expected;
}

/**
 * percentDiff(expected, actual) -> percent difference between expected and actual
 * returns ((actual - expected) / expected) * 100 (or 0 if expected==0)
 */
export function percentDiff(expected, actual) {
  const e = Number(expected ?? 0);
  const a = Number(actual ?? 0);
  if (!e) return a ? 100 : 0;
  return ((a - e) / e) * 100;
}
