import { useEffect, useState, useRef, useCallback } from "react";

interface UseInfiniteScrollProps<T> {
	fetchData: (page: number) => Promise<{ data: T[]; hasMore: boolean }>;
	threshold?: number; // 스크롤 트리거 위치 (px)
	initialPage?: number;
	maxItems?: number; // 최대 아이템 개수 (기본값: 무제한)
}

export default function useInfiniteScroll<T>({ fetchData, threshold = 1000, initialPage = 1, maxItems }: UseInfiniteScrollProps<T>) {
	const [data, setData] = useState<T[]>([]); // 가지고올 데이터
	const [currentPage, setCurrentPage] = useState(initialPage); // 현제 페이지 번호
	const [loading, setLoading] = useState(false); // 로딩중인지 확인
	const [hasMore, setHasMore] = useState(true); // 더 불러오 데이터 있는지 확인
	const [showScrollTop, setShowScrollTop] = useState(false); // 위로가기 버튼 표시 여부
	const isLoadingRef = useRef(false); // 중복 호출 방지

	// 데이터 로드 함수
	// 1. 처음 실행
	// 5. 또 실행 isLoadMore = true로 넘어옴
	const loadData = async (page: number, isLoadMore = false) => {
		// true 면 종료
		// 1-1. 처음에 false이므로 패스
		if (isLoadingRef.current) return;

		// 1-2. 바로 true로 변경해서 넘어감
		// 스크롤을 해도 아직 데이터를 안 가져왔다면 true이기 때문에 if (isLoadingRef.current) return; 리턴되서 돌아옴
		isLoadingRef.current = true;
		// 1-3. 데이터 불러 오기전 로딩
		setLoading(true);
		try {
			const result = await fetchData(page);
			// 초기에는 isLoadMore = false
			// true면 더보기 : 기존 데이터 + 새 데이터 함침
			// 6. isLoadMore = true이므로 실행
			if (isLoadMore) {
				setData((prev) => {
					// 기존 데이터에랑 새로 가져온 데이터를 합친다.
					const newData = [...prev, ...result.data];
					if (maxItems && newData.length >= maxItems) {
						// maxItems = 100 && newData.length가 100개가 넘거나 같을 때
						// setHasMore = false 더 가져올 데이터를 false로 변경
						// newData에 데이트를 0 ~ 100까지 자른다.
						setHasMore(false);
						// maxItems = 100 => 100개 넘으면 자른다
						return newData.slice(0, maxItems);
					} else {
						// newData.length가 100개가 안됐으므로 계속 새로운 데이터를 추가 해준다.
						setHasMore(result.hasMore);
						return newData;
					}
				});
			} else {
				// 2. 초기 데이터 설정
				// 초기 데이터를 setData에 담아서 출력
				setData(result.data);
				setHasMore(maxItems ? result.hasMore && result.data.length < maxItems : result.hasMore);
			}
		} catch (error) {
			console.error("데이터 로드 에러:", error);
			setHasMore(false);
		} finally {
			setLoading(false);
			// 데이터를 가져왔든 안 가져왔든 false로 변경
			isLoadingRef.current = false;
		}
	};

	// 더 불러오기
	// 4. 스크롤하면 실행
	const loadMore = useCallback(() => {
		// !isLoadingRef.current = true
		// hasMore = true
		if (!isLoadingRef.current && hasMore) {
			const nextPage = currentPage + 1;
			setCurrentPage(nextPage);
			// isLoadMore = true로 해서 새로운 데이터가 있다고 한다.
			// nextPage로 page수를 1개씩 추가한다.
			loadData(nextPage, true);
		}
	}, [currentPage, hasMore]);

	// 초기화 (카테고리 변경 등)
	const reset = () => {
		setCurrentPage(initialPage);
		setHasMore(true);
		setData([]);
		loadData(initialPage, false);
	};

	// 스크롤 이벤트
	useEffect(() => {
		const handleScroll = () => {
			setShowScrollTop(window.scrollY > 300);

			//window.innerHeight: 현재 보이는 화면 높이
			// document.documentElement.scrollTop: 현재 스크롤된 거리
			// document.documentElement.offsetHeight: 전체 페이지 높이
			// threshold (1000px): 바닥에서 1000px 전부터 미리 로딩 시작
			// !isLoadingRef.current = true;
			// hasMore = true
			// 3. 다 true이기 때문에 loadMore 실행

			if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - threshold && !isLoadingRef.current && hasMore) {
				loadMore();
			}
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, [loadMore, hasMore, threshold]);

	const scrollToTop = () => {
		window.scrollTo({
			top: 0,
			behavior: "smooth",
		});
	};

	return {
		data,
		loading,
		hasMore,
		showScrollTop,
		scrollToTop,
		loadMore,
		reset,
		loadData,
	};
}
