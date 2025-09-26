import Tab from "./component/tab";
import Articles from "./component/articles";

interface TabOption {
	title: string;
	category: string;
}

export default function Home({ searchParams }: { searchParams: { category?: string } }) {
	const tabOption: TabOption[] = [
		{ title: "전체", category: "all" },
		{ title: "경제", category: "business" },
		{ title: "정치", category: "politics" },
	];

	const selectedCategory = searchParams.category || "all";

	return (
		<div className="px-5">
			<Tab option={tabOption} />
			<Articles category={selectedCategory} />
		</div>
	);
}
