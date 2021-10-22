import { useContext } from 'react';
import dynamic from 'next/dynamic';
import Head from 'next/head';

import { SearchResultContext } from '../../client/contexts/search-result-context';
import SaveResults from '../../client/components/save-results/save-results';

const SearchResults = dynamic(
	() => import('../../client/components/search-results/search-results'),
	{
		ssr: false
	}
);

const NewSearchResults: React.FC = () => {
	const [context] = useContext(SearchResultContext);

	return (
		<>
			<Head>
				<title key='title'>Headlines - Media Bubbles</title>
				<link rel='canonical' href={`${process.env.NEXT_PUBLIC_URL}/headlines`} key='canonical' />
			</Head>
			<h1 className='text-info'>Search Results</h1>
			<SaveResults />
			<SearchResults
				sourceList={context.sourceListToSearch}
				isSearchAll={context.isSearchAll}
				articleMap={context.articleMap}
				savedResultId={context.savedResultId}
			/>
		</>
	);
};

export default NewSearchResults;
