import dynamic from 'next/dynamic';
import Head from 'next/head';

const SearchResults = dynamic(
	() => import('../../client/components/search-results/search-results'),
	{
		ssr: false
	}
);

const NewSearchResults = () => (
	<>
		<Head>
			<link rel='canonical' href={`${process.env.NEXT_PUBLIC_API_URL}/headlines`} key='canonical' />
		</Head>
		<SearchResults />
	</>
);

export default NewSearchResults;
