import type { Metadata } from 'next';
import { cacheTag } from 'next/cache';
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

const Search: React.FC = async () => {
	'use cache';
	cacheTag('source-lists');
	const { appSourceList, sourceListBySlant } = await getSourceLists();

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
