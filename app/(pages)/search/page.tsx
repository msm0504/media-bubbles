import type { Metadata } from 'next';
import SearchInstructions from '@/components/search-form/instructions';
import SearchTabs from '@/components/search-form/tabs';
import { getSourceLists } from '@/services/source-list-service';
import PageHeading from '@/components/shared/page-heading';

export const metadata: Metadata = {
	title: 'Search - Media Bubbles',
	alternates: {
		canonical: `${process.env.NEXT_PUBLIC_URL}/search`,
	},
};

const Search: React.FC = async () => {
	const { appSourceList, sourceListBySlant } = await getSourceLists();

	return (
		<>
			<PageHeading heading='Headlines Search' />
			<div className='flex flex-col gap-4'>
				<SearchTabs appSourceList={appSourceList} sourceListBySlant={sourceListBySlant} />
				<SearchInstructions />
			</div>
		</>
	);
};

export default Search;
