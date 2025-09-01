import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	// Disable i18n to prevent locale-based routing
	i18n: undefined,
	
	// Ensure proper routing
	trailingSlash: false,
};

export default nextConfig;
