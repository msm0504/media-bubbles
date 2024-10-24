import type { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_URL || '';

const robots = (): MetadataRoute.Robots => ({
	rules: {
		userAgent: '*',
		allow: '/',
		disallow: '/private/',
	},
	host: BASE_URL,
	sitemap: `${BASE_URL}/sitemap.xml`,
});

export default robots;
