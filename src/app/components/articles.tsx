"use client";

import { useEffect } from "react";
import TabOption from "../content/tabOption";
import NewsType from "../../../types/NewsType";
import Image from "next/image";
import Link from "next/link";
import useInfiniteScroll from "../hook/useInfiniteScroll";
import BookMarkButton from "./bookMarkButton";

export default function NewsArticles({ category }: { category: string }) {
	// 오늘 날짜
	const toDay = new Date();
	let year = toDay.getFullYear();
	let month = ("0" + (toDay.getMonth() + 1)).slice(-2);
	let day = ("0" + toDay.getDate()).slice(-2);
	const todayFormat = year + "-" + month + "-" + day;

	// 데이터 가져오기 함수
	const fetchNewsData = async (page: number): Promise<{ data: NewsType[]; hasMore: boolean }> => {
		let currentCategories = "";

		if (category == "all") {
			const categoryCopy = [...TabOption];
			categoryCopy.shift();
			const categoryArray = categoryCopy.map((data) => data.category);
			currentCategories = categoryArray.join();
		} else {
			currentCategories = category;
		}

		const res = await fetch(`/api/news?categories=${currentCategories}&date_from=${todayFormat}&date_to=${todayFormat}&page=${page}&page_size=9`);
		const result = await res.json();

		return {
			data: result.data || [],
			hasMore: result.total_pages ? page < result.total_pages : result.data && result.data.length >= 9,
		};
	};

	// 무한 스크롤 훅 사용
	const {
		data: newsData,
		loading,
		hasMore,
		showScrollTop,
		scrollToTop,
		reset,
	} = useInfiniteScroll<NewsType>({
		fetchData: fetchNewsData,
		threshold: 1000,
		maxItems: 100,
	});

	// 카테고리 변경 시 초기화
	useEffect(() => {
		reset();
	}, [category]);

	return (
		<div className="mt-2.5 sm:mt-5 grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-2.5 ">
			{newsData
				? newsData.map((item: NewsType, i: number) => {
						return (
							<div key={i} className="rounded-[10px] overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.08)] ">
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
										<div className="text-[14px] sm:text-[16px] font-semibold mb-1.5 overflow-hidden leading-[1.2] sm:leading-[1.4] overflow-ellipsis whitespace-nowrap ">
											{item.title}
										</div>
										<div className="ellipsis text-[12px] sm:text-[14px] mb-2.5 text-[#6b7280] leading-[1.2]">{item.summary}</div>
									</Link>
									<BookMarkButton data={item} />
								</div>
							</div>
						);
				  })
				: null}
			{loading && (
				<div className="col-span-full text-center py-3 sm:py-4">
					<div className="text-gray-500 text-[12px] sm:text-[16px]">로딩 중...</div>
				</div>
			)}
			{newsData.length >= 100 && (
				<div className="col-span-full text-center py-3 sm:py-4">
					<div className="text-gray-500 text-[12px] sm:text-[16px]">총 100개의 게시물을 모두 불러왔습니다.</div>
				</div>
			)}

			{/* 위로가기 버튼 */}
			{showScrollTop && (
				<button
					onClick={scrollToTop}
					className="fixed bottom-6 right-6 bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow-lg transition-all duration-300 z-50"
					aria-label="위로가기">
					<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
					</svg>
				</button>
			)}
		</div>
	);
}
