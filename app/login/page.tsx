"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast, Toaster } from "react-hot-toast";
import { useAuth } from "../../contexts/AuthContext";

export default function LoginPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();
	const { login } = useAuth();

	// Mock login credentials
	const MOCK_CREDENTIALS = {
		email: "admin@hotel.com",
		password: "admin123"
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		// Simulate API delay
		await new Promise(resolve => setTimeout(resolve, 1500));

		try {
			// Check mock credentials
			if (email === MOCK_CREDENTIALS.email && password === MOCK_CREDENTIALS.password) {
				// Mock successful login
				const mockUser = {
					id: "1",
					name: "John Doe",
					email: email,
					role: "owner" as const
				};

				await login(email, password);
				toast.success("Login successful! Welcome back.");
				
				// Redirect to dashboard
				setTimeout(() => {
					router.push("/dashboard");
				}, 1000);
			} else {
				toast.error("Invalid email or password. Please try again.");
			}
		} catch (error) {
			toast.error("Login failed. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
			<Toaster 
				position="top-right"
				toastOptions={{
					duration: 4000,
					style: {
						background: '#363636',
						color: '#fff',
					},
					success: {
						duration: 3000,
						iconTheme: {
							primary: '#4ade80',
							secondary: '#fff',
						},
					},
					error: {
						duration: 4000,
						iconTheme: {
							primary: '#ef4444',
							secondary: '#fff',
						},
					},
				}}
			/>
			
			<div className="w-full max-w-md">
				{/* Header */}
				<div className="text-center mb-8">
					<div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
						<svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
						</svg>
					</div>
					<h1 className="text-3xl font-bold text-gray-900 mb-2">Hotel Dashboard</h1>
					<p className="text-gray-600">Sign in to access your financial dashboard</p>
				</div>

				{/* Login Form */}
				<div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
					<form onSubmit={handleSubmit} className="space-y-6">
						<div>
							<label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
								Email Address
							</label>
							<input
								id="email"
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
								placeholder="Enter your email"
								required
								disabled={isLoading}
							/>
						</div>

						<div>
							<label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
								Password
							</label>
							<div className="relative">
								<input
									id="password"
									type={showPassword ? "text" : "password"}
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
									placeholder="Enter your password"
									required
									disabled={isLoading}
								/>
								<button
									type="button"
									onClick={() => setShowPassword(!showPassword)}
									className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
									disabled={isLoading}
								>
									{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
								</button>
							</div>
						</div>

						<button
							type="submit"
							disabled={isLoading}
							className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
						>
							{isLoading ? (
								<>
									<Loader2 className="w-5 h-5 animate-spin" />
									Signing in...
								</>
							) : (
								"Sign In"
							)}
						</button>
					</form>

					{/* Demo Credentials */}
					<div className="mt-6 p-4 bg-gray-50 rounded-lg">
						<h3 className="text-sm font-medium text-gray-700 mb-2">Demo Credentials:</h3>
						<div className="text-sm text-gray-600 space-y-1">
							<div><strong>Email:</strong> admin@hotel.com</div>
							<div><strong>Password:</strong> admin123</div>
						</div>
					</div>
				</div>

				{/* Footer */}
				<div className="text-center mt-6">
					<p className="text-sm text-gray-500">
						© 2024 Hotel Financial Dashboard. All rights reserved.
					</p>
				</div>
			</div>
		</div>
	);
}
