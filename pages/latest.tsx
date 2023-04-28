import { GetServerSideProps } from 'next';
import Head from 'next/head';

import SearchResults from '../client/components/search-results/search-results';
import { getLatestHeadlines } from '../server/services/bing-news-service';
import { ArticleMap } from '../types';

type LatestNewsProps = {
	latestArticleMap: ArticleMap;
};

const description = 'Latest news from across the political spectrum.';

const LatestNews: React.FC<LatestNewsProps> = ({ latestArticleMap }) => (
	<>
		<Head>
			<title key='title'>Latest News - Media Bubbles</title>
			<meta name='description' content={description}></meta>
			<meta property='og:title' content='Latest News' key='ogTitle'></meta>
			<meta property='og:description' content={description} key='ogDesc'></meta>
			<meta property='og:url' content={`${process.env.NEXT_PUBLIC_URL}/latest`} key='ogUrl'></meta>
			<link rel='canonical' href={`${process.env.NEXT_PUBLIC_URL}/latest`} key='canonical' />
		</Head>
		<h2 className='text-info h1'>Latest News</h2>
		<SearchResults sourceList={[]} isSearchAll articleMap={latestArticleMap} />
	</>
);

export default LatestNews;

export const getServerSideProps: GetServerSideProps = async () => {
	const latestArticleMap = await getLatestHeadlines();
	return {
		props: {
			latestArticleMap
		}
	};
};
