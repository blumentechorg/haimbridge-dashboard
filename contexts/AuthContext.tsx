"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { apiService } from "../lib/api";

export interface User {
	id: string;
	name: string;
	email: string;
	role: "owner" | "manager" | "viewer";
}

interface AuthContextType {
	user: User | null;
	loading: boolean;
	login: (email: string, password: string) => Promise<void>;
	logout: () => void;
	isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// Check for existing token on app load
		const token = localStorage.getItem("auth_token");
		if (token) {
			validateToken(token);
		} else {
			setLoading(false);
		}
	}, []);

	const validateToken = async (token: string) => {
		try {
			const userData = await apiService.getCurrentUser();
			setUser(userData);
		} catch (error) {
			console.error("Token validation failed:", error);
			localStorage.removeItem("auth_token");
		} finally {
			setLoading(false);
		}
	};

	const login = async (email: string, password: string) => {
		try {
			const response = await apiService.login(email, password);
			
			// Store token in localStorage and cookie
			localStorage.setItem("auth_token", response.token);
			document.cookie = `auth_token=${response.token}; path=/; max-age=${60 * 60 * 24 * 7}`; // 7 days
			
			// Set user data
			setUser(response.user);
		} catch (error) {
			console.error("Login failed:", error);
			throw error;
		}
	};

	const logout = () => {
		localStorage.removeItem("auth_token");
		document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
		setUser(null);
	};

	const value: AuthContextType = {
		user,
		loading,
		login,
		logout,
		isAuthenticated: !!user,
	};

	return (
		<AuthContext.Provider value={value}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
}
