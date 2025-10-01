import Image from "next/image";
import { Bookmark, Search } from "lucide-react";
import Link from "next/link";

export default function Header() {
	return (
		<div className="py-5 border-b border-[#dedede] relative">
			<Link href={"/?category=all"} className="link mb-[-4px]">
				<Image className="w-[120px]" src={"/images/logo.png"} width={256} height={69} alt={"logo"} quality={100} />
			</Link>
			<div className="flex gap-x-2.5 absolute right-5 top-[50%] translate-y-[-50%]">
				<Link href={"/search"} className="btn-option">
					<Search strokeWidth={3} />
				</Link>
				<Link href={"/bookmark"} className="btn-option">
					<Bookmark strokeWidth={3} />
				</Link>
			</div>
		</div>
	);
}
