import dynamic from 'next/dynamic';
const SearchResults = dynamic(
	() => import('../../client/components/search-results/search-results'),
	{
		ssr: false
	}
);

const NewSearchResults = () => <SearchResults />;

export default NewSearchResults;
