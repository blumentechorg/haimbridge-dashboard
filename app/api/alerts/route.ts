import { NextResponse } from "next/server";
import { detectAlerts, generateTransactions } from "../../../lib/mock";

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const fromParam = searchParams.get("from");
	const toParam = searchParams.get("to");
	const seed = Number(searchParams.get("seed") ?? 42);

	const to = toParam ? new Date(toParam) : new Date();
	const from = fromParam
		? new Date(fromParam)
		: new Date(to.getTime() - 29 * 24 * 60 * 60 * 1000);

	const txns = generateTransactions(from, to, seed);
	const alerts = detectAlerts(txns);
	return NextResponse.json({ alerts });
}

