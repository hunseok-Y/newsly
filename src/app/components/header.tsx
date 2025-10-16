import Image from "next/image";
import { Bookmark, Search } from "lucide-react";
import Link from "next/link";

export default function Header() {
	return (
		<div className="bg-white sticky top-0 z-100 w-auto mx-[-20px] xl:m-0">
			<div className="py-3.5 px-[20px] xl:py-5 xl:px-0 border-b border-[#dedede] flex items-center justify-between">
				<Link href={"/?category=all"} className="link mb-[-4px]">
					<Image className="w-[80px] lg:w-[120px]" src={"/images/logo.png"} width={256} height={69} alt={"logo"} quality={100} />
				</Link>
				<div className="flex gap-x-2.5">
					<Link href={"/search"} className="btn-option">
						<Search strokeWidth={3} />
					</Link>
					<Link href={"/bookmark"} className="btn-option">
						<Bookmark strokeWidth={3} />
					</Link>
				</div>
			</div>
		</div>
	);
}
