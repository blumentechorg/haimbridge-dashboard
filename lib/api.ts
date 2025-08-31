import api from './axios';
import type { Transaction, MetricsSummary, AlertItem } from './mock';

interface User {
	id: string;
	name: string;
	email: string;
	role: 'owner' | 'finance' | 'viewer';
}

interface AuthResponse {
	token: string;
	user: User;
}

// API service functions
export const apiService = {
	// Metrics
	async getMetrics(from: string, to: string): Promise<{ summary: MetricsSummary }> {
		const response = await api.get(`/metrics?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`);
		return response.data;
	},

	// Transactions
	async getTransactions(from: string, to: string): Promise<{ transactions: Transaction[] }> {
		const response = await api.get(`/transactions?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`);
		return response.data;
	},

	// Alerts
	async getAlerts(from: string, to: string): Promise<{ alerts: AlertItem[] }> {
		const response = await api.get(`/alerts?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`);
		return response.data;
	},

	// Auth
	async login(email: string, password: string): Promise<AuthResponse> {
		const response = await api.post('/auth/login', { email, password });
		return response.data;
	},

	async getCurrentUser(): Promise<{ user: User }> {
		const response = await api.get('/auth/me');
		return response.data;
	},

	// Reports
	async generateReport(type: string, from: string, to: string): Promise<Blob> {
		const response = await api.get(`/reports/${type}?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`, {
			responseType: 'blob'
		});
		return response.data;
	}
};
