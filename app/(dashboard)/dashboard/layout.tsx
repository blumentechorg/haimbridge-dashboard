import { ReactNode } from "react";
import Sidebar from "./_parts/Sidebar";
import Topbar from "./_parts/Topbar";

export default function DashboardLayout({
	children,
}: {
	children: ReactNode;
}) {
	return (
		<div className="min-h-screen grid grid-rows-[auto_1fr] md:grid-rows-1 md:grid-cols-[auto_1fr]">
			{/* Sidebar */}
			<Sidebar />
			
			{/* Content */}
			<div className="flex flex-col min-h-screen">
				<Topbar />
				<main className="p-4 md:p-6 space-y-6 overflow-y-auto flex-1">{children}</main>
			</div>
		</div>
	);
}

