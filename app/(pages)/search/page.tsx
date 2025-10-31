import type { Metadata } from 'next';
import { unstable_cache as cache } from 'next/cache';
import { Stack, Typography } from '@mui/material';
import SearchInstructions from '@/components/search-form/instructions';
import SearchTabs from '@/components/search-form/tabs';
import { getSourceLists } from '@/services/source-list-service';

export const metadata: Metadata = {
	title: 'Search - Media Bubbles',
	alternates: {
		canonical: `${process.env.NEXT_PUBLIC_URL}/search`,
	},
};

const getCachedSourceLists = cache(async () => await getSourceLists(), ['source-lists']);

const Search: React.FC = async () => {
	const { appSourceList, sourceListBySlant } = await getCachedSourceLists();

	return (
		<>
			<Typography component='h2' variant='h3' color='info' marginBottom={2} fontWeight='bold'>
				Headlines Search
			</Typography>
			<Stack spacing={4}>
				<SearchTabs appSourceList={appSourceList} sourceListBySlant={sourceListBySlant} />
				<SearchInstructions />
			</Stack>
		</>
	);
};

export default Search;
