import { Dispatch, SetStateAction } from "react";
import NewsType from "../../../types/NewsType";

interface NewsDataHandlerParams {
	res: { data: NewsType[] };
	isLoadMore: boolean;
	newsData: NewsType[];
	setNewsData: Dispatch<SetStateAction<NewsType[]>>;
	setHasMore: Dispatch<SetStateAction<boolean>>;
	setLoading: Dispatch<SetStateAction<boolean>>;
}

export default function NewsDataHandler({ res, isLoadMore, newsData, setNewsData, setHasMore, setLoading }: NewsDataHandlerParams) {
	// 데이터가 있는지 확인
	const newsDataArray = res.data || [];

	// 첫 로드 vs 추가 로드 구분
	if (isLoadMore) {
		setNewsData((prev) => [...prev, ...newsDataArray]); // 기존 데이터에 추가
	} else {
		setNewsData(newsDataArray); // 새로 교체
	}
	// 100개 제한 로직
	const currentTotal = isLoadMore ? newsData.length + newsDataArray.length : newsDataArray.length;
	const hasMoreData = newsDataArray.length > 0 && currentTotal < 100;
	setHasMore(hasMoreData);

	// 로딩 완료
	setLoading(false);
}
