"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../../../../contexts/AuthContext";
import { 
	LayoutDashboard, 
	Receipt, 
	AlertTriangle, 
	FileText, 
	Settings, 
	LogOut,
	ChevronLeft,
	ChevronRight
} from "lucide-react";

export default function Sidebar() {
	const [isCollapsed, setIsCollapsed] = useState(false);
	const pathname = usePathname();
	const { logout } = useAuth();

	const menuItems = [
		{ href: "/dashboard", label: "Overview", icon: LayoutDashboard },
		{ href: "/dashboard/transactions", label: "Transactions", icon: Receipt },
		{ href: "/dashboard/alerts", label: "Alerts", icon: AlertTriangle },
		{ href: "/dashboard/reports", label: "Reports", icon: FileText },
	];

	const handleLogout = () => {
		logout();
	};

	return (
		<aside className={`hidden md:flex flex-col sticky top-0 h-screen border-r bg-background/80 backdrop-blur transition-all duration-300 ${
			isCollapsed ? "w-16" : "w-56"
		}`}>
			{/* Header */}
			<div className="flex items-center justify-between p-4 border-b">
				{!isCollapsed && (
					<h1 className="font-semibold text-lg">Hotel Dashboard</h1>
				)}
				<button
					onClick={() => setIsCollapsed(!isCollapsed)}
					className="p-1 rounded-md hover:bg-gray-100 transition-colors"
				>
					{isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
				</button>
			</div>

			{/* Navigation */}
			<nav className="flex-1 p-4 space-y-2">
				{menuItems.map((item) => {
					const Icon = item.icon;
					const isActive = pathname === item.href;
					
					return (
						<Link
							key={item.href}
							href={item.href}
							className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-gray-50 hover:shadow-sm ${
								isActive 
									? "bg-blue-50 text-blue-600 border border-blue-200 shadow-sm" 
									: "text-gray-700 hover:text-gray-900"
							}`}
						>
							<Icon size={20} />
							{!isCollapsed && <span>{item.label}</span>}
						</Link>
					);
				})}
			</nav>

			{/* Bottom Section */}
			<div className="p-4 border-t space-y-2">
				<button className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50 hover:shadow-sm transition-all duration-200 w-full">
					<Settings size={20} />
					{!isCollapsed && <span>Settings</span>}
				</button>
				<button 
					onClick={handleLogout}
					className="flex items-center gap-3 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 hover:shadow-sm transition-all duration-200 w-full"
				>
					<LogOut size={20} />
					{!isCollapsed && <span>Log Out</span>}
				</button>
			</div>
		</aside>
	);
}
