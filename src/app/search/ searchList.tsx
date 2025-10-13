"use client";

import { SetStateAction, useEffect, useState } from "react";
import NewsType from "../../../types/NewsType";
import Link from "next/link";
import Image from "next/image";
import useInfiniteScroll from "../hook/useInfiniteScroll";

export default function SearchList() {
	const [inputValue, setInputValue] = useState("");
	const [currentKeyword, setCurrentKeyword] = useState("");
	// 결과 유무
	const [searchResults, setSearchResults] = useState(false);
	// 로컬 스토리지 키워드
	const [keyWord, setKeyWord] = useState<string[]>([]);

	// 검색 데이터 가져오기 함수
	const fetchSearchData = async (page: number): Promise<{ data: NewsType[]; hasMore: boolean }> => {
		const res = await fetch(`/api/search?keyword=${currentKeyword}&page=${page}`);
		const result = await res.json();

		setSearchResults(result.data && result.data.length === 0);

		return {
			data: result.data || [],
			hasMore: result.total_pages ? page < result.total_pages : result.data && result.data.length > 0,
		};
	};

	// 무한 스크롤 훅 사용
	const {
		data: searchData,
		loading,
		hasMore,
		showScrollTop,
		scrollToTop,
		reset,
	} = useInfiniteScroll<NewsType>({
		fetchData: fetchSearchData,
		threshold: 1000,
	});

	function handleSearch(e: React.FormEvent) {
		e.preventDefault();
		setCurrentKeyword(inputValue);
		addKeyword(inputValue);
		setSearchResults(false);
	}

	// currentKeyword 변경 시 검색 실행
	useEffect(() => {
		if (currentKeyword) {
			reset();
		}
	}, [currentKeyword]);

	// 로컬스토리지에 접근해서 keyword 정보 가져오기
	useEffect(() => {
		const keyword = localStorage.getItem("keyword");

		if (keyword) {
			setKeyWord(JSON.parse(keyword));
		}
	}, []);

	function addKeyword(newItem: string) {
		// 중복 제거 후 배열 반환
		const filteredKeywords = keyWord.filter((item) => item !== newItem);
		// 새로운 검색어랑 기존 검색 배열을 함침
		const newKeywords = [newItem, ...filteredKeywords];

		// 5개로 제한
		const limitedKeywords = newKeywords.slice(0, 5);

		setKeyWord(limitedKeywords);
		localStorage.setItem("keyword", JSON.stringify(limitedKeywords));
	}

	const inputChange = (e: { target: { value: SetStateAction<string> } }) => {
		setInputValue(e.target.value);
	};

	return (
		<div>
			<div className="flex gap-x-2.5">
				<input type="text" value={inputValue} placeholder="검색어를 입력하세요" onChange={inputChange} id="search" className="border px-5 border-[#dedede] w-full rounded-[10px]" />
				<button onClick={handleSearch} className="w-[60px] h-[40px] text-white bg-(--color-primary) rounded-[10px]" type="submit">
					검색
				</button>
			</div>
			<div className="flex gap-x-2.5 py-5">
				<span>최근 검색어 :</span>
				<div className=" flex gap-x-1 ">
					{keyWord
						? keyWord.map((item, i) => {
								return (
									<div key={i}>
										<button className="cursor-pointer hover:text-(--color-primary)" onClick={() => setInputValue(item)}>
											{item}
										</button>
									</div>
								);
						  })
						: null}
				</div>
			</div>
			<div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-2.5 ">
				{searchData.map((item, i) => {
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
				})}
			</div>
			{loading && (
				<div className="col-span-full text-center py-4">
					<div className="text-gray-500">로딩 중...</div>
				</div>
			)}
			{searchResults && <div className="text-gray-500">검색 결과가 없습니다.</div>}

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
