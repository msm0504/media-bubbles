import Head from 'next/head';
import { useRouter } from 'next/router';

import APIActions from '../../client/actions/api-actions';
import SearchResults from '../../client/components/search-results/search-results';
import { wrapper } from '../../client/store/store';
import { getLatestHeadlines } from '../../server/services/twitter-news-service';

const LatestHeadlines = () => {
	const router = useRouter();
	return (
		<>
			<Head>
				<meta
					property='og:url'
					content={`${process.env.NEXT_PUBLIC_API_URL}${router.asPath}`}
					key='ogUrl'
				></meta>
				<meta property='og:title' content='Latest Headlines'></meta>
				<meta
					property='og:description'
					content='Recent news from sources across the political spectrum'
				></meta>
				<link rel='canonical' href={`${process.env.NEXT_PUBLIC_API_URL}${router.asPath}`} />
			</Head>
			<SearchResults isLatest />
		</>
	);
};

export default LatestHeadlines;

export const getServerSideProps = wrapper.getServerSideProps(async ({ store }) => {
	const latestArticleMap = await getLatestHeadlines({ spectrumSearchAll: true });
	if (latestArticleMap && Object.keys(latestArticleMap).length) {
		store.dispatch(APIActions.latestLoaded(latestArticleMap));
	}
});
