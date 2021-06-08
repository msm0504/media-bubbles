import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Card } from 'react-bootstrap';

import Spinner from '../../client/components/spinner';
import SearchResults from '../../client/components/search-results/search-results';
import { getSavedResult, getAllSavedResults } from '../../server/services/saved-results-service';
import { SavedResult } from '../../types';

type SavedSearchResultProps = {
	loadedResult: SavedResult;
	notFound: boolean;
};

const formatDescription = ({ createdAt = '0', sourceList = [] }: SavedResult) =>
	`Result saved at: ${new Date(createdAt).toLocaleString()}
${sourceList.length ? `Sources: ${sourceList.map(source => source.name).join(', ')}` : ''}`;

const SavedSearchResult: React.FC<SavedSearchResultProps> = ({ loadedResult, notFound }) => {
	const router = useRouter();

	return router.isFallback ? (
		<Spinner />
	) : notFound ? (
		<Card.Body className='text-info'>{'No saved search result found for this id'}</Card.Body>
	) : (
		<>
			<Head>
				<title key='title'>{`Saved Result from ${new Date(
					loadedResult?.createdAt || '0'
				).toLocaleString()} - Media Bubbles`}</title>
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
			<h1 className='text-info'>{`Saved Result: ${loadedResult.name}`}</h1>
			<SearchResults
				sourceList={loadedResult.sourceList}
				isSearchAll={loadedResult.isSearchAll}
				articleMap={loadedResult.articleMap}
				savedResultId={loadedResult._id}
			/>
		</>
	);
};

export default SavedSearchResult;

export const getStaticProps: GetStaticProps = async ({ params }) => {
	const loadedResult = (await getSavedResult(params?.resultId as string)) || {};
	const resultFound = loadedResult && Object.keys(loadedResult).length;

	return {
		props: {
			loadedResult,
			notFound: !resultFound
		}
	};
};

export const getStaticPaths: GetStaticPaths = async () => {
	const { items: savedResults } = await getAllSavedResults();

	return {
		paths: savedResults.map(({ _id }) => ({ params: { resultId: _id } })),
		fallback: true
	};
};
