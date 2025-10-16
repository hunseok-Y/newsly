import { ObjectId } from "mongodb";

export interface Post {
	// mongodb의 실제 타입
	_id: ObjectId;
	id: string;
	title: string;
	content_url: string;
	summary: string;
	image_url: string;
}

export interface BookmarkType {
	// 인터페이스 전달용 타입
	_id: string;
	id: string;
	title: string;
	content_url: string;
	summary: string;
	image_url: string;
}
