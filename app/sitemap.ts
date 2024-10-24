import type { MetadataRoute } from 'next';
import { getAllSavedResults } from '@/services/saved-results-service';

const BASE_URL = process.env.NEXT_PUBLIC_URL || '';
// Google's limit is 50,000 URLs per sitemap
const MAX_SAVED_RESULTS = 49950;

const sitemap = async (): Promise<MetadataRoute.Sitemap> => {
	const { items: savedResults } = await getAllSavedResults('', 1, MAX_SAVED_RESULTS);
	return [
		{
			url: BASE_URL,
			lastModified: new Date(),
		},
		{
			url: `${BASE_URL}/about`,
			lastModified: new Date(),
		},
		{
			url: `${BASE_URL}/contact`,
			lastModified: new Date(),
		},
		{
			url: `${BASE_URL}/headlines`,
			lastModified: new Date(),
		},
		{
			url: `${BASE_URL}/latest`,
			lastModified: new Date(),
		},
		{
			url: `${BASE_URL}/privacy-policy`,
			lastModified: new Date(),
		},
		{
			url: `${BASE_URL}/search`,
			lastModified: new Date(),
		},
		{
			url: `${BASE_URL}/terms`,
			lastModified: new Date(),
		},
		...savedResults.map(({ _id, createdAt }) => ({
			url: `${BASE_URL}/headlines/${_id}`,
			lastModified: createdAt,
		})),
	];
};

export default sitemap;
