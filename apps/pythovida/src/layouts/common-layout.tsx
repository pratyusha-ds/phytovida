import { Outlet } from "react-router";
import { Header } from "@/components/header";

export default function CommonLayout() {
	return (
		<div className="max-w-7xl mx-auto  ">
			<Header />
			<main>
				<Outlet />
			</main>
		</div>
	);
}
