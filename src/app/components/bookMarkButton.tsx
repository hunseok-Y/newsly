"use client";

import { useState } from "react";
import { Bookmark } from "lucide-react";

type BookmarkData = {
	id: string;
	title: string;
	content_url: string;
	summary: string;
	image_url: string;
};

type BookMarkButtonProps = {
	data: BookmarkData;
	mode?: "toggle" | "delete-only";
	initialBookmarked?: boolean;
	onDelete?: () => void;
};

export default function BookMarkButton({ data, mode = "toggle", initialBookmarked = false, onDelete }: BookMarkButtonProps) {
	const [isBookmark, setIsBookmark] = useState(initialBookmarked);

	// 북마크 추가 API 호출
	const addBookmark = async (previousState: boolean) => {
		try {
			const response = await fetch("/api/bookmark", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					id: data.id,
					title: data.title,
					content_url: data.content_url,
					summary: data.summary,
					image_url: data.image_url,
				}),
			});

			if (!response.ok) {
				console.error("북마크 추가 실패");
				setIsBookmark(previousState);
			}
		} catch (error) {
			console.error("북마크 추가 중 에러:", error);
			setIsBookmark(previousState);
		}
	};

	// 북마크 삭제 API 호출
	const deleteBookmark = async (previousState: boolean) => {
		try {
			const response = await fetch("/api/bookmark", {
				method: "DELETE",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ id: data.id }),
			});

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({}));
				console.error("북마크 삭제 실패:", response.status, errorData);
				setIsBookmark(previousState);
			}
		} catch (error) {
			console.error("북마크 삭제 중 에러:", error);
			setIsBookmark(previousState);
		}
	};

	const handleClick = () => {
		if (mode === "delete-only") {
			// 삭제 전용 모드: 즉시 UI 업데이트
			setIsBookmark(false);
			onDelete?.();
			deleteBookmark(true);
		} else {
			// 토글 모드: 즉시 UI 업데이트
			const previousState = isBookmark;
			const newState = !isBookmark;
			setIsBookmark(newState);

			if (newState) {
				addBookmark(previousState);
			} else {
				deleteBookmark(previousState);
			}
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
