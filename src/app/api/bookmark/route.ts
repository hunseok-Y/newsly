import { connectDB } from "@/util/database";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
	try {
		const db = (await connectDB).db("newsly");
		let result = await db.collection("bookmark").find().toArray();
		return NextResponse.json(result);
	} catch (error) {
		console.error("북마크 조회 에러:", error);
		return NextResponse.json({ error: "서버 오류", details: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
	}
}

export async function POST(request: NextRequest) {
	try {
		const db = (await connectDB).db("newsly");
		const body = await request.json();

		// 중복 체크: 이미 존재하는지 확인
		const existing = await db.collection("bookmark").findOne({ id: body.id });
		if (existing) {
			return NextResponse.json({ message: "이미 북마크된 항목입니다" }, { status: 200 });
		}

		// bookmark에 insertOne추가 시켜라
		await db.collection("bookmark").insertOne(body);

		return NextResponse.json({ message: "북마크 추가 성공" }, { status: 200 });
	} catch (error) {
		console.error("북마크 추가 에러:", error);
		return NextResponse.json({ error: "서버 오류", details: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
	}
}

export async function DELETE(request: NextRequest) {
	try {
		const db = (await connectDB).db("newsly");
		const body = await request.json();

		// id 필드로 삭제 (MongoDB의 _id가 아닌 커스텀 id 필드 사용)
		const result = await db.collection("bookmark").deleteOne({ id: body.id });

		if (result.deletedCount === 0) {
			return NextResponse.json({ error: "삭제할 북마크를 찾을 수 없습니다" }, { status: 404 });
		}

		return NextResponse.json({ message: "북마크 삭제 성공" }, { status: 200 });
	} catch (error) {
		console.error("북마크 삭제 에러:", error);
		return NextResponse.json({ error: "서버 오류", details: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
	}
}
