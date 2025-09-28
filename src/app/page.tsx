import Tab from "./components/tab";
import Articles from "./components/articles";
import TabOption from "./content/tabOption";

export default function Home({ searchParams }: { searchParams: { category?: string } }) {
	const selectedCategory = searchParams.category || "all";

	return (
		<div>
			<Tab option={TabOption} />
			<Articles category={selectedCategory} />
		</div>
	);
}
