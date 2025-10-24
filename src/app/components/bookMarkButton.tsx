"use client";

import { useState } from "react";
import NewsType from "../../../types/NewsType";
import { Bookmark } from "lucide-react";

type BookMarkButtonProps = {
	data: NewsType | any;
	mode?: "toggle" | "delete-only";
	initialBookmarked?: boolean;
	onDelete?: () => void;
};

export default function BookMarkButton({ data, mode = "toggle", initialBookmarked = false, onDelete }: BookMarkButtonProps) {
	const [isBookmark, setIsBookmark] = useState(initialBookmarked);
	const [isLoading, setIsLoading] = useState(false);

	const handleClick = async () => {
		if (isLoading) return; // 중복 클릭 방지

		setIsLoading(true);

		if (mode === "delete-only") {
			// 삭제 전용 모드: 즉시 UI 업데이트
			if (isBookmark) {
				// 낙관적 업데이트: 먼저 UI 변경
				setIsBookmark(false);
				if (onDelete) {
					onDelete();
				}

				// 백그라운드에서 API 호출
				try {
					const response = await fetch("/api/bookmark", {
						method: "DELETE",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ id: data.id }),
					});

					if (!response.ok) {
						// 실패 시 원래 상태로 되돌림
						const error = await response.json();
						console.error("북마크 삭제 실패:", error);
						setIsBookmark(true);
						alert("북마크 삭제에 실패했습니다.");
					}
				} catch (error) {
					// 네트워크 에러 시 원래 상태로 되돌림
					console.error("북마크 삭제 중 에러:", error);
					setIsBookmark(true);
					alert("북마크 삭제 중 오류가 발생했습니다.");
				} finally {
					setIsLoading(false);
				}
			}
		} else {
			// 토글 모드: 즉시 UI 업데이트
			const previousState = isBookmark;
			const newState = !isBookmark;

			// 낙관적 업데이트: 먼저 UI 변경
			setIsBookmark(newState);

			try {
				if (newState) {
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

					if (!response.ok) {
						// 실패 시 원래 상태로 되돌림
						const error = await response.json();
						console.error("북마크 추가 실패:", error);
						setIsBookmark(previousState);
						alert("북마크 추가에 실패했습니다.");
					}
				} else {
					// 북마크 삭제
					const response = await fetch("/api/bookmark", {
						method: "DELETE",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ id: data.id }),
					});

					if (!response.ok) {
						// 실패 시 원래 상태로 되돌림
						const error = await response.json();
						console.error("북마크 삭제 실패:", error);
						setIsBookmark(previousState);
						alert("북마크 삭제에 실패했습니다.");
					}
				}
			} catch (error) {
				// 네트워크 에러 시 원래 상태로 되돌림
				console.error("북마크 처리 중 에러:", error);
				setIsBookmark(previousState);
				alert("북마크 처리 중 오류가 발생했습니다.");
			} finally {
				setIsLoading(false);
			}
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
