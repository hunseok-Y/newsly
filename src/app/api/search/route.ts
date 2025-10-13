import { NextRequest, NextResponse } from "next/server";

const NEWS_API_KEY = process.env.NEXT_PUBLIC_NEWS_API;

export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams;
	const keyword = searchParams.get("keyword");
	const page = searchParams.get("page") || "1";
	try {
		const response = await fetch(`https://api-v2.deepsearch.com/v1/articles?keyword=${keyword}&api_key=${NEWS_API_KEY}&page=${page}&page_size=10`);

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const data = await response.json();

		// 전체 결과와 총 개수를 포함하여 반환
		return NextResponse.json({
			articles: data.data || data.articles || data,
			total: data.total || data.data?.length || 0,
			...data,
		});
	} catch (error) {
		console.error("API Error:", error);
		return NextResponse.json({ error: "Failed to fetch news data" }, { status: 500 });
	}
}
