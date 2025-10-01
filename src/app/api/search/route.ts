import { NextRequest, NextResponse } from "next/server";

const NEWS_API_KEY = process.env.NEXT_PUBLIC_NEWS_API;

export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams;
	const keyword = searchParams.get("keyword");
	try {
		const response = await fetch(`https://api-v2.deepsearch.com/v1/articles?keyword=${keyword}&clustering=true&page=1&page_size=10&api_key=${NEWS_API_KEY}`);

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
