"use client";

import Link from "next/link";
import TabType from "../../../types/TabType";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

export default function Tab({ option }: { option: TabType[] }) {
	const getCategory = useSearchParams();
	const categoryName = getCategory.get("category");
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const lastTab = option[option.length - 1];
		if (categoryName === lastTab.category && containerRef.current) {
			containerRef.current.scrollTo({
				left: containerRef.current.scrollWidth,
				behavior: "smooth",
			});
		}
	}, [categoryName, option]);

	return (
		<div className="py-3 xl:py-5 flex gap-1.5 xl:gap-x-2.5 overflow-x-auto w-full" ref={containerRef}>
			{option.map((tab, i) => {
				return (
					<Link
						key={i}
						href={`/?category=${tab.category}`}
						className={
							categoryName == tab.category
								? "px-2.5 py-1.5 rounded-[20px] text-[12px] xl:px-5 xl:py-2.5 xl:text-[14px] bg-(--color-primary) text-white flex-[0_0_auto]"
								: "px-2.5 py-1.5 rounded-[20px] text-[12px] xl:px-5 xl:py-2.5 xl:text-[14px] border-[1px] border-solid border-[#e0e0e0] text-[#2d2d2d] flex-[0_0_auto] hover:bg-(--color-primary) hover:text-white transition-all transition-0.4s"
						}>
						{tab.title}
					</Link>
				);
			})}
		</div>
	);
}
