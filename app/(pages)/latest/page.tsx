import type { Metadata } from 'next';
import { Typography } from '@mui/material';
import type { SearchRequest } from '@/types';
import { getHeadlines } from '@/services/bsky-news-service';
import SearchResults from '@/components/search-results/search-results';

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

const LATEST_NEWS_PARAMS: SearchRequest = {
	sources: '',
	spectrumSearchAll: 'Y',
	keyword: '',
	previousDays: 1,
};

const LatestNews: React.FC = async () => {
	'use cache';
	const latestArticleMap = await getHeadlines(LATEST_NEWS_PARAMS);
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
