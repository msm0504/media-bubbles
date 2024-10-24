'use client';
import { useContext } from 'react';
import dynamic from 'next/dynamic';
import { Box, Stack } from '@mui/material';
import { SearchResultContext } from '@/contexts/search-result-context';
import SaveResults from '@/components/save-results/save-results';

const SearchResults = dynamic(() => import('@/components/search-results/search-results'), {
	ssr: false,
});

const DynamicResults: React.FC = () => {
	const [context] = useContext(SearchResultContext);

	return (
		<Stack spacing={4}>
			<Box>
				<SaveResults />
			</Box>
			<SearchResults
				sourceList={context.sourceListToSearch}
				isSearchAll={context.isSearchAll}
				articleMap={context.articleMap}
				savedResultId={context.savedResultId}
			/>
		</Stack>
	);
};

export default DynamicResults;
