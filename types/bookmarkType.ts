import { ObjectId } from "mongodb";

export interface Post {
	_id: ObjectId;
	id: string;
	title: string;
	content_url: string;
	summary: string;
	image_url: string;
}

export interface BookmarkType {
	_id: string;
	id: string;
	title: string;
	content_url: string;
	summary: string;
	image_url: string;
}
