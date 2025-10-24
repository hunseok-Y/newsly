import { connectDB } from "@/util/database";
import BookMarkList from "./bookmarkList";
import { BookmarkType, Post } from "../../../types/bookmarkType";

// 페이지를 동적으로 렌더링하고 캐시하지 않음
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function BookMark() {
	try {
		console.log("북마크 페이지 로딩 시작...");

		const db = (await connectDB).db("newsly");
		const data = (await db.collection("bookmark").find().toArray()) as Post[];

		console.log(`북마크 데이터 ${data.length}개 조회 완료`);

		// ObjectId를 문자열로 변환하여 클라이언트 컴포넌트에 전달
		const result: BookmarkType[] = data.map((item) => ({
			...item,
			_id: item._id.toString(),
		}));

		return (
			<div>
				<div className="text-center text-[20px] sm:text-[28px] py-2.5 sm:py-5">북마크</div>
				<BookMarkList result={result} />
			</div>
		);
	} catch (error) {
		console.error("북마크 페이지 로딩 에러:", error);
		return (
			<div className="text-center py-10">
				<div className="text-red-500 text-[20px] mb-4">북마크를 불러오는 중 오류가 발생했습니다</div>
				<div className="text-gray-600 text-[14px]">
					{error instanceof Error ? error.message : "알 수 없는 오류"}
				</div>
				<div className="text-gray-500 text-[12px] mt-2">
					Vercel 환경 변수 설정을 확인하세요.
				</div>
			</div>
		);
	}
}
