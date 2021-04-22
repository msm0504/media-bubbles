import Head from 'next/head';
import { useRouter } from 'next/router';
import { CardBody } from 'reactstrap';

import APIActions from '../../client/actions/api-actions';
import Spinner from '../../client/components/spinner';
import SearchResults from '../../client/components/search-results/search-results';
import { wrapper } from '../../client/store/store';
import { getSavedResult, getAllSavedResults } from '../../server/services/saved-results-service';

const formatDescription = ({ createdAt = 0, sourceList = [] }) =>
	`Result saved at: ${new Date(createdAt).toLocaleString()}
${sourceList.length ? `Sources: ${sourceList.map(source => source.name).join(', ')}` : ''}`;

const SavedSearchResults = ({ loadedResult, notFound }) => {
	const router = useRouter();

	return router.isFallback ? (
		<Spinner />
	) : notFound ? (
		<CardBody className='text-info'>{'No saved search result found for this id'}</CardBody>
	) : (
		<>
			<Head>
				<meta
					property='og:url'
					content={`${process.env.NEXT_PUBLIC_API_URL}${router.asPath}`}
					key='ogUrl'
				></meta>
				<meta property='og:title' content={loadedResult.name} key='ogTitle'></meta>
				<meta
					property='og:description'
					content={formatDescription(loadedResult)}
					key='ogDesc'
				></meta>
				<link
					rel='canonical'
					href={`${process.env.NEXT_PUBLIC_API_URL}${router.asPath}`}
					key='canonical'
				/>
			</Head>
			<SearchResults />
		</>
	);
};

export default SavedSearchResults;

export const getStaticProps = wrapper.getStaticProps(async ({ params, store }) => {
	const loadedResult = (await getSavedResult(params.resultId)) || {};
	const resultFound = loadedResult && Object.keys(loadedResult).length;
	if (resultFound) {
		store.dispatch(APIActions.resultLoaded(loadedResult));
	}

	return {
		props: {
			loadedResult,
			notFound: !resultFound
		}
	};
});

export async function getStaticPaths() {
	const { savedResults } = await getAllSavedResults();

	return {
		paths: savedResults.map(({ _id }) => ({ params: { resultId: _id } })),
		fallback: true
	};
}
