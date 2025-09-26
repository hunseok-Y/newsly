"use client";

const NEWS_API_KEY = process.env.NEWS_API_KEY;

export default function NewsArticles({ category }: { category: string }) {
	return (
		<div className="mt-5">
			<div>{category}</div>
		</div>
	);
}
