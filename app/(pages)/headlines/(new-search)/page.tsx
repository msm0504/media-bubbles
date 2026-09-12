'use client';
import { useContext } from 'react';
import dynamic from 'next/dynamic';
import { SearchResultContext } from '@/contexts/search-result-context';
import SaveResults from '@/components/save-results/save-results';

const SearchResults = dynamic(() => import('@/components/search-results/search-results'), {
	ssr: false,
});

const DynamicResults: React.FC = () => {
	const [context] = useContext(SearchResultContext);

	return (
		<div className='flex flex-col gap-4'>
			<div>
				<SaveResults />
			</div>
			<SearchResults
				sourceList={context.sourceListToSearch}
				isSearchAll={context.isSearchAll}
				articleMap={context.articleMap}
				savedResultId={context.savedResultId}
			/>
		</div>
	);
};

export default DynamicResults;
