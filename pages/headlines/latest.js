import Head from 'next/head';
import { useRouter } from 'next/router';

import APIActions from '../../client/actions/api-actions';
import SearchResults from '../../client/components/search-results/search-results';
import { wrapper } from '../../client/store/store';
import { getHeadlines } from '../../server/services/twitter-news-service';

const SEC_IN_FIFTEEN_MIN = 60 * 15;

const SavedSearchResults = () => {
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

export default SavedSearchResults;

export const getStaticProps = wrapper.getStaticProps(async ({ store }) => {
	const latestArticleMap = await getHeadlines({ spectrumSearchAll: true });
	if (latestArticleMap && Object.keys(latestArticleMap).length) {
		store.dispatch(APIActions.latestLoaded(latestArticleMap));
	}
	return {
		revalidate: SEC_IN_FIFTEEN_MIN
	};
});
