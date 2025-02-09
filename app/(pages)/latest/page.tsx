import type { Metadata } from 'next';
import { unstable_cache as cache } from 'next/cache';
import { Typography } from '@mui/material';
import type { SearchRequest } from '@/types';
import { getHeadlines } from '@/services/bsky-news-service';
import SearchResults from '@/components/search-results/search-results';

const SECONDS_IN_FIFTEEN_MIN = 60 * 15;

export const metadata: Metadata = {
	title: 'Latest News - Media Bubbles',
	description: 'Latest news from across the political spectrum.',
	openGraph: {
		title: 'Latest News',
		description: 'Latest news from across the political spectrum.',
		url: `${process.env.NEXT_PUBLIC_URL}/latest`,
	},
	alternates: {
		canonical: `${process.env.NEXT_PUBLIC_URL}/latest`,
	},
};

const getCachedLatestNews = cache(
	async () => {
		const params: SearchRequest = {
			sources: '',
			spectrumSearchAll: 'Y',
			keyword: '',
			previousDays: 1,
		};
		return getHeadlines(params);
	},
	['latest-news'],
	{ revalidate: SECONDS_IN_FIFTEEN_MIN }
);

const LatestNews: React.FC = async () => {
	const latestArticleMap = await getCachedLatestNews();
	return (
		<>
			<Typography component='h2' variant='h3' color='info' marginBottom={2} fontWeight='bold'>
				Latest News
			</Typography>
			<SearchResults sourceList={[]} isSearchAll articleMap={latestArticleMap} />
		</>
	);
};

export default LatestNews;
