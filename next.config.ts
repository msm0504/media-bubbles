import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	cacheComponents: true,
	images: {
		qualities: [75, 100],
		localPatterns: [{ pathname: '/images/slant-bubbles/*' }, { pathname: '/api/source-logo' }],
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'i.creativecommons.org',
				port: '',
				pathname: '/l/by-nc/4.0/**',
			},
		],
	},
};

export default nextConfig;
