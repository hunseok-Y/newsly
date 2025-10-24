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
	const [isLoading, setIsLoading] = useState(false);

	const handleClick = async () => {
		if (isLoading) return; // 중복 클릭 방지

		try {
			setIsLoading(true);

			if (mode === "delete-only") {
				// 삭제 전용 모드: 삭제만 가능
				if (isBookmark) {
					const response = await fetch("/api/bookmark", {
						method: "DELETE",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ id: data.id }),
					});

					if (response.ok) {
						setIsBookmark(false);
					} else {
						const error = await response.json();
						console.error("북마크 삭제 실패:", error);
						alert("북마크 삭제에 실패했습니다.");
					}
				}
			} else {
				// 토글 모드: 추가/삭제 가능
				if (isBookmark) {
					// 북마크 삭제
					const response = await fetch("/api/bookmark", {
						method: "DELETE",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ id: data.id }),
					});

					if (response.ok) {
						setIsBookmark(false);
					} else {
						const error = await response.json();
						console.error("북마크 삭제 실패:", error);
						alert("북마크 삭제에 실패했습니다.");
					}
				} else {
					// 북마크 추가
					const response = await fetch("/api/bookmark", {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({
							id: data.id,
							title: data.title,
							content_url: data.content_url,
							summary: data.summary,
							image_url: data.image_url
						}),
					});

					if (response.ok) {
						setIsBookmark(true);
					} else {
						const error = await response.json();
						console.error("북마크 추가 실패:", error);
						alert("북마크 추가에 실패했습니다.");
					}
				}
			}
		} catch (error) {
			console.error("북마크 처리 중 에러:", error);
			alert("북마크 처리 중 오류가 발생했습니다.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="flex">
			<button type="button" onClick={handleClick} disabled={isLoading} className="w-[20px] sm:w-[26px] ml-auto" style={{ opacity: isLoading ? 0.5 : 1 }}>
				<Bookmark fill={isBookmark ? "#3b82f6" : "#fff"} className="w-full h-full text-[#a4a4a4]" strokeWidth={isBookmark ? 0 : 1.6} />
			</button>
		</div>
	);
}
