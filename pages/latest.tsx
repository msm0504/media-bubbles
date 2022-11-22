import { GetStaticProps } from 'next';
import Head from 'next/head';

import SearchResults from '../client/components/search-results/search-results';
import { getLatestHeadlines } from '../server/services/twitter-news-service';
import { ArticleMap } from '../types';

const SECONDS_IN_FIFTEEN_MIN = 60 * 15;

type LatestNewsProps = {
	latestArticleMap: ArticleMap;
};

const LatestNews: React.FC<LatestNewsProps> = ({ latestArticleMap }) => (
	<>
		<Head>
			<title key='title'>Latest News - Media Bubbles</title>
			<link rel='canonical' href={`${process.env.NEXT_PUBLIC_URL}/latest`} key='canonical' />
		</Head>
		<h1 className='text-info'>Latest News</h1>
		<SearchResults sourceList={[]} isSearchAll articleMap={latestArticleMap} />
	</>
);

export default LatestNews;

export const getStaticProps: GetStaticProps = async () => {
	const latestArticleMap = await getLatestHeadlines();
	return {
		props: {
			latestArticleMap
		},
		revalidate: SECONDS_IN_FIFTEEN_MIN
	};
};
