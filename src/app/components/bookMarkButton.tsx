"use client";

import { useState } from "react";
import NewsType from "../../../types/NewsType";
import { Bookmark } from "lucide-react";
import { ObjectId } from "mongodb";

export default function BookMarkButton({ data }: { data: NewsType }) {
	const [isBookmark, setIsBookmark] = useState(false);

	async function setData() {
		if (isBookmark) {
			// DELETE 요청
			await fetch("/api/bookmark", {
				method: "DELETE",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ id: data.id }),
			});
		} else {
			// POST 요청
			await fetch("/api/bookmark", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ id: data.id, title: data.title, content_url: data.content_url, summary: data.summary, image_url: data.image_url }),
			});
		}
	}

	return (
		<div className="flex">
			<button
				type="button"
				onClick={() => {
					// setIsBookmark(!isBookmark);
					setData();
					// console.log(data, isBookmark);
				}}
				className="w-[26px] ml-auto">
				<Bookmark fill={isBookmark ? "#3b82f6" : "#fff"} className="w-full h-full text-[#a4a4a4]" strokeWidth={isBookmark ? 0 : 1.6} />
			</button>
		</div>
	);
}
