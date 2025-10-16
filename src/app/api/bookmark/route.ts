import { connectDB } from "@/util/database";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
	try {
		const db = (await connectDB).db("newsly");
		// 데이터를 find 찾아와서 toArray배열로 꿔라
		let result = await db.collection("bookmark").find().toArray();
		return NextResponse.json(result);
	} catch (error) {
		return NextResponse.json({ error: "서버 오류" }, { status: 500 });
	}
}

export async function POST(request: NextRequest) {
	try {
		const db = (await connectDB).db("newsly");
		const body = await request.json();

		// bookmark에 insertOne추가 시켜라
		await db.collection("bookmark").insertOne(body);

		return NextResponse.json({ message: "북마크 추가 성공" }, { status: 200 });
	} catch (error) {
		return NextResponse.json({ error: "서버 오류" }, { status: 500 });
	}
}

export async function DELETE(request: NextRequest) {
	try {
		const db = (await connectDB).db("newsly");
		const body = await request.json();

		await db.collection("bookmark").deleteOne(body);
		return NextResponse.json({ message: "북마크 삭제 성공" }, { status: 200 });
	} catch (error) {
		return NextResponse.json({ error: "서버 오류" }, { status: 500 });
	}
}
