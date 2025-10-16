import { NextRequest, NextResponse } from "next/server";

const NEWS_API_KEY = process.env.NEXT_PUBLIC_NEWS_API;

export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams;
	const categories = searchParams.get("categories");
	const dateFrom = searchParams.get("date_from");
	const dateTo = searchParams.get("date_to");
	const page = searchParams.get("page") || "1";
	const pageSize = searchParams.get("page_size") || "9";

	try {
		const response = await fetch(`https://api-v2.deepsearch.com/v1/articles/${categories}?date_from=${dateFrom}&date_to=${dateTo}&page=${page}&page_size=${pageSize}&api_key=${NEWS_API_KEY}`);

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const data = await response.json();
		return NextResponse.json(data);
	} catch (error) {
		console.error("API Error:", error);
		return NextResponse.json({ error: "Failed to fetch news data" }, { status: 500 });
	}
}
