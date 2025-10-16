"use client";

import { useState } from "react";
import NewsType from "../../../types/NewsType";
import { Bookmark } from "lucide-react";

type BookMarkButtonProps = {
	data: NewsType | any;
	mode?: "toggle" | "delete-only";
	initialBookmarked?: boolean;
};

export default function BookMarkButton({ data, mode = "toggle", initialBookmarked = false }: BookMarkButtonProps) {
	const [isBookmark, setIsBookmark] = useState(initialBookmarked);

	async function setData() {
		if (isBookmark) {
			//DELETE 요청 - data.id를 전송하여 _id와 비교 후 삭제
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

	const handleClick = () => {
		if (mode === "delete-only") {
			// 삭제 전용 모드: 삭제만 가능
			if (isBookmark) {
				setIsBookmark(false);
				setData();
			}
		} else {
			// 기본적으로 mode = toggle
			// 토글 모드: 추가/삭제 가능
			setIsBookmark(!isBookmark);
			setData();
		}
	};

	return (
		<div className="flex">
			<button type="button" onClick={handleClick} className="w-[20px] sm:w-[26px] ml-auto">
				<Bookmark fill={isBookmark ? "#3b82f6" : "#fff"} className="w-full h-full text-[#a4a4a4]" strokeWidth={isBookmark ? 0 : 1.6} />
			</button>
		</div>
	);
}
