import axios from "./axios";
import type { Transaction, MetricsSummary, AlertItem } from "./mock";

export interface User {
	id: string;
	name: string;
	email: string;
	role: "owner" | "manager" | "viewer";
}

export interface AuthResponse {
	token: string;
	user: User;
}

// Mock user data
const MOCK_USER: User = {
	id: "1",
	name: "John Doe",
	email: "admin@hotel.com",
	role: "owner"
};

// Mock token
const MOCK_TOKEN = "mock_jwt_token_12345";

class ApiService {
	async getMetrics(fromDate?: string, toDate?: string): Promise<MetricsSummary> {
		try {
			const response = await axios.get("/api/metrics");
			return response.data.summary; // Access the nested 'summary' property
		} catch (error) {
			console.error("Failed to fetch metrics:", error);
			// Return mock data as fallback
			const now = new Date();
			const from = fromDate || new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
			const to = toDate || now.toISOString();
			
			return {
				from,
				to,
				totalDeclared: 24000000, // ₦24M
				totalRemitted: 21000000, // ₦21M
				remittanceVariance: 3000000, // ₦3M
				occupancyRate: 0.85,
				gopMargin: 0.25,
				byStream: {
					room_booking: { declared: 12000000, remitted: 11000000 }, // ₦12M declared, ₦11M remitted
					service_charge: { declared: 2000000, remitted: 1800000 }, // ₦2M declared, ₦1.8M remitted
					restaurant: { declared: 4000000, remitted: 3800000 }, // ₦4M declared, ₦3.8M remitted
					bar: { declared: 3000000, remitted: 2800000 }, // ₦3M declared, ₦2.8M remitted
					event_hosting: { declared: 2000000, remitted: 1800000 }, // ₦2M declared, ₦1.8M remitted
					misc: { declared: 1000000, remitted: 900000 } // ₦1M declared, ₦900K remitted
				},
				byPaymentMethod: {
					cash: 4000000, // ₦4M
					card: 12000000, // ₦12M
					transfer: 6000000, // ₦6M
					wallet: 2000000 // ₦2M
				}
			};
		}
	}

	async getTransactions(): Promise<Transaction[]> {
		try {
			const response = await axios.get("/api/transactions");
			return response.data.data; // Access the nested 'data' property
		} catch (error) {
			console.error("Failed to fetch transactions:", error);
			// Return mock data as fallback
			const mockTransactions: Transaction[] = [
				{
					id: "1",
					date: "2024-01-15T10:30:00Z",
					stream: "room_booking",
					paymentMethod: "card",
					amountDeclared: 25000,
					amountRemitted: 25000,
					roomNights: 2,
				},
				{
					id: "2",
					date: "2024-01-15T14:20:00Z",
					stream: "restaurant",
					paymentMethod: "cash",
					amountDeclared: 8500,
					amountRemitted: 8000,
				},
				{
					id: "3",
					date: "2024-01-15T16:45:00Z",
					stream: "bar",
					paymentMethod: "transfer",
					amountDeclared: 3200,
					amountRemitted: 3200,
				},
				{
					id: "4",
					date: "2024-01-15T18:30:00Z",
					stream: "event_hosting",
					paymentMethod: "card",
					amountDeclared: 150000,
					amountRemitted: 140000,
				},
				{
					id: "5",
					date: "2024-01-15T20:15:00Z",
					stream: "service_charge",
					paymentMethod: "wallet",
					amountDeclared: 5000,
					amountRemitted: 5000,
				},
				{
					id: "6",
					date: "2024-01-16T09:00:00Z",
					stream: "room_booking",
					paymentMethod: "card",
					amountDeclared: 30000,
					amountRemitted: 30000,
					roomNights: 1,
				},
				{
					id: "7",
					date: "2024-01-16T12:30:00Z",
					stream: "restaurant",
					paymentMethod: "cash",
					amountDeclared: 12000,
					amountRemitted: 11500,
				},
				{
					id: "8",
					date: "2024-01-16T15:45:00Z",
					stream: "bar",
					paymentMethod: "transfer",
					amountDeclared: 4500,
					amountRemitted: 4500,
				},
				{
					id: "9",
					date: "2024-01-16T17:20:00Z",
					stream: "misc",
					paymentMethod: "card",
					amountDeclared: 8000,
					amountRemitted: 7500,
				},
				{
					id: "10",
					date: "2024-01-16T19:00:00Z",
					stream: "room_booking",
					paymentMethod: "wallet",
					amountDeclared: 35000,
					amountRemitted: 35000,
					roomNights: 2,
				},
				{
					id: "11",
					date: "2024-01-17T08:30:00Z",
					stream: "restaurant",
					paymentMethod: "cash",
					amountDeclared: 9500,
					amountRemitted: 9000,
				},
				{
					id: "12",
					date: "2024-01-17T11:15:00Z",
					stream: "bar",
					paymentMethod: "transfer",
					amountDeclared: 2800,
					amountRemitted: 2800,
				},
			];
			return mockTransactions;
		}
	}

	async getAlerts(): Promise<AlertItem[]> {
		try {
			const response = await axios.get("/api/alerts");
			return response.data.alerts; // Access the nested 'alerts' property
		} catch (error) {
			console.error("Failed to fetch alerts:", error);
			// Return mock data as fallback
			const mockAlerts: AlertItem[] = [
				{
					id: "1",
					severity: "high",
					message: "Under-remittance detected for room_booking",
					date: "2024-01-15T10:30:00Z",
					variance: 150000,
				},
				{
					id: "2",
					severity: "medium",
					message: "Under-remittance detected for restaurant",
					date: "2024-01-15T14:20:00Z",
					variance: 5000,
				},
				{
					id: "3",
					severity: "low",
					message: "Under-remittance detected for bar",
					date: "2024-01-15T16:45:00Z",
					variance: 2000,
				},
				{
					id: "4",
					severity: "high",
					message: "Large variance on event_hosting transaction",
					date: "2024-01-15T18:30:00Z",
					variance: 10000,
				},
				{
					id: "5",
					severity: "medium",
					message: "Under-remittance detected for service_charge",
					date: "2024-01-15T20:15:00Z",
					variance: 3000,
				},
				{
					id: "6",
					severity: "low",
					message: "Under-remittance detected for misc",
					date: "2024-01-16T09:00:00Z",
					variance: 1500,
				},
				{
					id: "7",
					severity: "high",
					message: "Large variance on room_booking transaction",
					date: "2024-01-16T12:30:00Z",
					variance: 25000,
				},
				{
					id: "8",
					severity: "medium",
					message: "Under-remittance detected for restaurant",
					date: "2024-01-16T15:45:00Z",
					variance: 8000,
				},
				{
					id: "9",
					severity: "low",
					message: "Under-remittance detected for bar",
					date: "2024-01-16T17:20:00Z",
					variance: 1200,
				},
				{
					id: "10",
					severity: "medium",
					message: "Under-remittance detected for event_hosting",
					date: "2024-01-16T19:00:00Z",
					variance: 15000,
				},
				{
					id: "11",
					severity: "high",
					message: "Large variance on room_booking transaction",
					date: "2024-01-17T08:30:00Z",
					variance: 30000,
				},
				{
					id: "12",
					severity: "medium",
					message: "Under-remittance detected for restaurant",
					date: "2024-01-17T11:15:00Z",
					variance: 6000,
				},
			];
			return mockAlerts;
		}
	}

	async login(email: string, password: string): Promise<AuthResponse> {
		// Mock authentication
		if (email === "admin@hotel.com" && password === "admin123") {
			// Simulate API delay
			await new Promise(resolve => setTimeout(resolve, 1000));
			
			return {
				token: MOCK_TOKEN,
				user: MOCK_USER
			};
		} else {
			throw new Error("Invalid credentials");
		}
	}

	async getCurrentUser(): Promise<User> {
		// Mock user data
		return MOCK_USER;
	}

	async generateReport(reportType: string, fromDate: string, toDate: string): Promise<Blob> {
		// Mock report generation
		const mockData = `Report Type: ${reportType}\nFrom: ${fromDate}\nTo: ${toDate}\nGenerated: ${new Date().toISOString()}`;
		return new Blob([mockData], { type: "text/plain" });
	}
}

export const apiService = new ApiService();
