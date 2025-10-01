"use client";

import Link from "next/link";
import TabType from "../../../types/TabType";
import { useSearchParams } from "next/navigation";

export default function Tab({ option }: { option: TabType[] }) {
	const getCategory = useSearchParams();
	const categoryName = getCategory.get("category");

	return (
		<div className="py-5 flex gap-x-2.5">
			{option.map((tab, i) => {
				return (
					<Link
						key={i}
						href={`/?category=${tab.category}`}
						className={
							categoryName == tab.category
								? "px-5 py-2.5 rounded-[20px] text-[14px] bg-(--color-primary) text-white"
								: "px-5 py-2.5 border-[1px] border-solid border-[#e0e0e0] text-[#2d2d2d] rounded-[20px] text-[14px] hover:bg-(--color-primary) hover:text-white transition-all transition-0.4s"
						}>
						{tab.title}
					</Link>
				);
			})}
		</div>
	);
}
