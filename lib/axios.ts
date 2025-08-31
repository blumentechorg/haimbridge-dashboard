import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
	timeout: 10000,
	headers: {
		'Content-Type': 'application/json',
	},
});

// Request interceptor to add auth token
api.interceptors.request.use(
	(config) => {
		// Get token from localStorage or sessionStorage
		const token = typeof window !== 'undefined' 
			? localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')
			: null;
		
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

// Response interceptor for error handling
api.interceptors.response.use(
	(response) => {
		return response;
	},
	(error) => {
		// Handle 401 Unauthorized
		if (error.response?.status === 401) {
			// Clear auth data and redirect to login
			if (typeof window !== 'undefined') {
				localStorage.removeItem('auth_token');
				sessionStorage.removeItem('auth_token');
				window.location.href = '/login';
			}
		}
		
		// Handle 403 Forbidden
		if (error.response?.status === 403) {
			console.error('Access forbidden');
		}
		
		return Promise.reject(error);
	}
);

export default api;
