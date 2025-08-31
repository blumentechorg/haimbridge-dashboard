"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../lib/axios';

interface User {
	id: string;
	name: string;
	email: string;
	role: 'owner' | 'finance' | 'viewer';
}

interface AuthContextType {
	user: User | null;
	loading: boolean;
	login: (email: string, password: string) => Promise<boolean>;
	logout: () => void;
	isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// Check for existing token on app load
		const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
		if (token) {
			// Validate token with backend
			validateToken();
		} else {
			setLoading(false);
		}
	}, []);

	const validateToken = async () => {
		try {
			const response = await api.get('/auth/me');
			setUser(response.data.user);
		} catch (error) {
			// Token is invalid, clear it
			localStorage.removeItem('auth_token');
			sessionStorage.removeItem('auth_token');
		} finally {
			setLoading(false);
		}
	};

	const login = async (email: string, password: string): Promise<boolean> => {
		try {
			setLoading(true);
			const response = await api.post('/auth/login', { email, password });
			const { token, user } = response.data;
			
			// Store token
			localStorage.setItem('auth_token', token);
			
			// Set user
			setUser(user);
			
			return true;
		} catch (error) {
			console.error('Login failed:', error);
			return false;
		} finally {
			setLoading(false);
		}
	};

	const logout = () => {
		// Clear auth data
		localStorage.removeItem('auth_token');
		sessionStorage.removeItem('auth_token');
		setUser(null);
		
		// Redirect to login
		window.location.href = '/login';
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
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
}
