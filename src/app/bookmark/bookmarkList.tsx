"use client";

import Link from "next/link";
import { BookmarkType } from "../../../types/bookmarkType";
import BookMarkButton from "../components/bookMarkButton";
import Image from "next/image";
import { useState } from "react";

export default function BookMarkList({ result }: { result: BookmarkType[] }) {
	const [bookmarks, setBookmarks] = useState<BookmarkType[]>(result);

	const handleDelete = (id: string) => {
		// 삭제된 항목을 리스트에서 제거
		setBookmarks((prev) => prev.filter((item) => item.id !== id));
	};

	return (
		<div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-2.5 ">
			{bookmarks.length === 0 ? (
				<div className="col-span-full text-center py-10 text-gray-500">
					북마크된 항목이 없습니다.
				</div>
			) : (
				bookmarks.map((item, i) => {
					return (
						<div key={item.id} className="rounded-[10px] overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.08)] ">
							<div className="w-full h-[120px] sm:h-[180px] relative">
								{item.image_url ? (
									<Image
										className="img-set"
										src={item.image_url}
										fill={true}
										sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
										alt={"thumbnail"}
										quality={100}
										priority={i < 4}
									/>
								) : (
									<Image src={"/images/no_image.svg"} className="no-img" alt="대체이미지" width={500} height={500} />
								)}
							</div>
							<div className="p-[10px_20px]">
								<Link href={item.content_url} target="_blank">
									<div className="text-[14px] sm:text-[16px] font-semibold mb-1.5 overflow-hidden leading-[1.2] sm:leading-[1.4] overflow-ellipsis whitespace-nowrap ">{item.title}</div>
									<div className="ellipsis text-[12px] sm:text-[14px] mb-2.5 text-[#6b7280] leading-[1.2]">{item.summary}</div>
								</Link>
								{/* mode 추가해서 북마크 페이지인지 구분 */}
								{/* initialBookmarked 현재 북마크가 활성화가 됐는지 확인 */}
								<BookMarkButton data={item} mode="delete-only" initialBookmarked={true} onDelete={() => handleDelete(item.id)} />
							</div>
						</div>
					);
				})
			)}
		</div>
	);
}
