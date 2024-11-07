import type { Metadata } from 'next';
import { unstable_cache as cache } from 'next/cache';
import { Stack } from '@mui/material';
import SearchInstructions from '@/components/search-form/instructions';
import SearchTabs from '@/components/search-form/tabs';
import { getSourceLists } from '@/services/source-list-service';
import PageHeading from '@/components/shared/page-heading';

const SECONDS_IN_WEEK = 60 * 60 * 24 * 7;

export const metadata: Metadata = {
	title: 'Search - Media Bubbles',
	alternates: {
		canonical: `${process.env.NEXT_PUBLIC_URL}/search`,
	},
};

const getCachedSourceLists = cache(async () => await getSourceLists(), ['source-lists'], {
	revalidate: SECONDS_IN_WEEK,
});

const Search: React.FC = async () => {
	const { appSourceList, sourceListBySlant } = await getCachedSourceLists();

	return (
		<>
			<PageHeading heading='Headlines Search' />
			<Stack spacing={4}>
				<SearchTabs appSourceList={appSourceList} sourceListBySlant={sourceListBySlant} />
				<SearchInstructions />
			</Stack>
		</>
	);
};

export default Search;
