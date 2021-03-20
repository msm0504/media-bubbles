import APIActions from '../../client/actions/api-actions';
import SearchResults from '../../client/components/search-results/search-results';
import Head from 'next/head';
import { useRouter } from 'next/router';

import APIService from '../../client/services/api-service';
import { wrapper } from '../../client/store/store';

const SavedSearchResults = ({ loadedResult: { name, createdAt = 0, sourceList = {} } }) => {
	const router = useRouter();
	const description = `Result saved at: ${new Date(createdAt).toLocaleString()}
${sourceList.length ? `Sources: ${sourceList.map(source => source.name).join(', ')}` : ''}`;

	return (
		<>
			<Head>
				<meta
					property='og:url'
					content={`${process.env.NEXT_PUBLIC_API_URL}${router.asPath}`}
					key='ogUrl'
				></meta>
				<meta property='og:title' content={name}></meta>
				<meta property='og:description' content={description}></meta>
			</Head>
			<SearchResults />
		</>
	);
};

export default SavedSearchResults;

export const getServerSideProps = wrapper.getServerSideProps(async ({ params, store }) => {
	const loadedResult = await APIService.callApi('get', `searchResult/${params.resultId}`);
	if (loadedResult && Object.keys(loadedResult).length) {
		store.dispatch(APIActions.resultLoaded(loadedResult));
	}

	return {
		props: {
			loadedResult
		}
	};
});
