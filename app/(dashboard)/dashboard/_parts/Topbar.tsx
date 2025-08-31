"use client";

import DateRangePicker from "./DateRangePicker";
import ProfileDropdown from "./ProfileDropdown";
import Link from "next/link";

export default function Topbar() {
	return (
		<header className="sticky top-0 z-40 border-b backdrop-blur bg-background/70">
			<div className="flex items-center justify-between px-4 md:px-6 h-14">
				<div className="flex items-center gap-3">
					<Link href="/dashboard" className="font-semibold">Hotel Owner Dashboard</Link>
				</div>
				<div className="flex items-center gap-4">
					<DateRangePicker />
					<ProfileDropdown />
				</div>
			</div>
		</header>
	);
}


