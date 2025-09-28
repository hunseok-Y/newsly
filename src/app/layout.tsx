import "./globals.css";
import Header from "./components/header";

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body>
				<div className="xl:w-[1200px] lg:w-full lg:p-[0_40px] m-[0_auto] p-[0_20px]">
					<Header />
					{children}
				</div>
			</body>
		</html>
	);
}
