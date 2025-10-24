import { MongoClient } from "mongodb";

const url = process.env.MONGODB_URI;

if (!url) {
	throw new Error("MONGODB_URI 환경 변수가 설정되지 않았습니다. .env.local 파일을 확인하세요.");
}

declare global {
	var _mongo: Promise<MongoClient> | undefined;
}

let connectDB: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
	if (!global._mongo) {
		global._mongo = new MongoClient(url).connect();
	}
	connectDB = global._mongo;
} else {
	connectDB = new MongoClient(url).connect();
}

export { connectDB };
