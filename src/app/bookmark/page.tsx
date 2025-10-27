import { connectDB } from "@/util/database";
import BookMarkList from "./bookmarkList";
import { BookmarkType, Post } from "../../../types/bookmarkType";

// 동적 렌더링 강제 (Vercel 캐싱 방지)
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function BookMark() {
	// const client = await connectDB;
	// const db = client.db("newsly")
	// 위에 생략 방법
	const db = (await connectDB).db("newsly");
	const data = (await db.collection("bookmark").find().toArray()) as Post[];

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
}
