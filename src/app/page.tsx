import Tab from "./components/tab";
import Articles from "./components/articles";
import TabOption from "./content/tabOption";

export default async function Home({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
	const params = await searchParams;
	const selectedCategory = params.category || "all";

	return (
		<div className="">
			<Tab option={TabOption} />
			<Articles category={selectedCategory} />
		</div>
	);
}
