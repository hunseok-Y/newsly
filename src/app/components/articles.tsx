"use client";

import { useEffect, useState } from "react";
import TabOption from "../content/tabOption";
import NewsType from "../../../types/NewsType";
import Image from "next/image";
import Link from "next/link";

const NEWS_API_KEY = process.env.NEXT_PUBLIC_NEWS_API;

export default function NewsArticles({ category }: { category: string }) {
	// 뉴스 데이터 배열
	const [newsData, setNewsData] = useState<NewsType[]>([]);
	// 현재 페이지 번호
	const [currentPage, setCurrentPage] = useState(1);
	// 로딩 상태
	const [loading, setLoading] = useState(false);
	// 더 불러올 데이터가 있는지
	const [hasMore, setHasMore] = useState(true);
	// 위로가기 버튼 표시 여부
	const [showScrollTop, setShowScrollTop] = useState(false);

	function loadNewsData(page = 1, isLoadMore = false) {
		if (category == "all") {
			setLoading(true);
			const categoryCopy = [...TabOption];
			// 배열 첫번째 요소 삭제
			categoryCopy.shift();
			// 카테고리 값만 추출해서 배열로 만듬
			const categoryArray = categoryCopy.map((data) => {
				return data.category;
			});
			// category 텍스트로 변환
			const copy = categoryArray.join();

			// 오늘 날짜
			const toDay = new Date();
			let year = toDay.getFullYear();
			let month = ("0" + (toDay.getMonth() + 1)).slice(-2);
			let day = ("0" + toDay.getDate()).slice(-2);
			const todayFormat = year + "-" + month + "-" + day;

			fetch(`https://api-v2.deepsearch.com/v1/articles/${copy}?date_from=${todayFormat}&date_to=${todayFormat}&page=${page}&page_size=9&api_key=${NEWS_API_KEY}`)
				.then((res) => res.json())
				.then((res) => {
					console.log(`페이지 ${page} 응답:`, res.data);
					console.log(`받은 데이터 개수: ${res.data.length}`);
					// 첫 로드 vs 추가 로드 구분
					if (isLoadMore) {
						setNewsData((prev) => [...prev, ...res.data]); // 기존 데이터에 추가
					} else {
						setNewsData(res.data); // 새로 교체
					}
					// 100개 제한 로직
					const currentTotal = isLoadMore ? newsData.length + res.data.length : res.data.length;
					const hasMoreData = res.data.length > 0 && currentTotal < 100;
					setHasMore(hasMoreData);
					// 100개 제한 로직

					// 로딩 완료
					setLoading(false);
				})
				.catch((error) => {
					console.error("API 에러:", error);
					setLoading(false);
				});
		}
	}

	function loadMore() {
		if (!loading && hasMore) {
			const nextPage = currentPage + 1;
			setCurrentPage(nextPage);
			loadNewsData(nextPage, true);
		}
	}

	useEffect(() => {
		setCurrentPage(1);
		loadNewsData(1, false);
	}, [category]);

	// 스크롤 이벤트 감지
	useEffect(() => {
		const handleScroll = () => {
			// 위로가기 버튼 표시/숨김 (300px 이상 스크롤 시)
			setShowScrollTop(window.scrollY > 300);

			// 무한 스크롤
			if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 1000 && !loading && hasMore) {
				loadMore();
			}
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, [loading, hasMore, currentPage]);

	const scrollToTop = () => {
		window.scrollTo({
			top: 0,
			behavior: "smooth",
		});
	};

	return (
		<div className="mt-5 grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-2.5 ">
			{newsData
				? newsData.map((item: NewsType, i: number) => {
						return (
							<div key={i} className="rounded-[10px] overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
								<div className="w-full h-[180px] relative">
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
									<Link href={item.content_url} about="_blank">
										<div className="text-[16px] font-semibold mb-1.5 overflow-hidden leading-[1.4] overflow-ellipsis whitespace-nowrap">{item.title}</div>
										<div className="ellipsis text-[14px] mb-2.5 text-[#6b7280] leading-[1.2]">{item.summary}</div>
									</Link>
								</div>
							</div>
						);
				  })
				: null}
			{loading && (
				<div className="col-span-full text-center py-4">
					<div className="text-gray-500">로딩 중...</div>
				</div>
			)}
			{newsData.length >= 100 && (
				<div className="col-span-full text-center py-4">
					<div className="text-gray-500">총 100개의 게시물을 모두 불러왔습니다.</div>
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
