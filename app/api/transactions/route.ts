import { NextResponse } from "next/server";
import { generateTransactions } from "../../../lib/mock";

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const fromParam = searchParams.get("from");
	const toParam = searchParams.get("to");
	const seed = Number(searchParams.get("seed") ?? 42);

	const to = toParam ? new Date(toParam) : new Date();
	const from = fromParam
		? new Date(fromParam)
		: new Date(to.getTime() - 29 * 24 * 60 * 60 * 1000);

	const data = generateTransactions(from, to, seed);
	return NextResponse.json({ data });
}

