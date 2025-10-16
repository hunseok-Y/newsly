import { MongoClient } from "mongodb";

const url = "mongodb+srv://gnstjr5911_db_user:ghehf6737@cluster0.vhv68jv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
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
