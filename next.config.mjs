/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
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
