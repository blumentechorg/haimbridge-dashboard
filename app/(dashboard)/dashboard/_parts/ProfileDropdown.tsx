"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, User, Lock, LogOut } from "lucide-react";
import { useAuth } from "../../../../contexts/AuthContext";

export default function ProfileDropdown() {
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);
	const { user, logout } = useAuth();

	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				setIsOpen(false);
			}
		}

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const handleLogout = () => {
		logout();
		setIsOpen(false);
	};

	if (!user) return null;

	return (
		<div className="relative" ref={dropdownRef}>
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-all duration-200 hover:shadow-sm"
			>
				<div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
					{user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
				</div>
				<div className="hidden sm:block text-left">
					<div className="text-sm font-medium">{user.name}</div>
					<div className="text-xs text-gray-500 capitalize">{user.role}</div>
				</div>
				<ChevronDown 
					size={16} 
					className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
				/>
			</button>

			{isOpen && (
				<div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
					<button className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
						<User size={16} />
						Profile
					</button>
					<button className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
						<Lock size={16} />
						Change Password
					</button>
					<div className="border-t my-1"></div>
					<button 
						onClick={handleLogout}
						className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
					>
						<LogOut size={16} />
						Log Out
					</button>
				</div>
			)}
		</div>
	);
}
