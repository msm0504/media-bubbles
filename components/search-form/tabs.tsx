'use client';
import { useMemo } from 'react';
import SearchForm from './search-form';
import MySavedResults from '../save-results/my-saved-results';
import { Button, Select } from '../shared/base-ui';
import type { Source } from '@/types';
import { SEARCH_MODE_MAP, type SearchMode } from '@/constants/search-mode';
import useLocalStorage from '@/hooks/use-local-storage';
import { keys } from '@/util/typed-keys';

type SearchTabsProps = {
	appSourceList: Source[];
	sourceListBySlant: Source[][];
};

const SEARCH_MODE_IDS = keys(SEARCH_MODE_MAP);

const SearchTabs: React.FC<SearchTabsProps> = ({ appSourceList, sourceListBySlant }) => {
	const [curSearchMode, setSearchMode] = useLocalStorage<SearchMode>(
		'searchMode',
		SEARCH_MODE_IDS[0]
	);

	const getCurrentSearchModeInfo = useMemo(
		() => () => SEARCH_MODE_MAP[curSearchMode].description,
		[curSearchMode]
	);

	const onSearchModeChange = (searchModeId: SearchMode) => {
		setSearchMode(searchModeId);
	};

	return (
		<div className='flex flex-col gap-4'>
			<div className='block md:hidden'>
				<Select
					className='w-full text-lg'
					color='info'
					variant='contained'
					items={Object.entries(SEARCH_MODE_MAP).map(([searchModeId, searchMode]) => ({
						label: searchMode.name,
						value: searchModeId,
					}))}
					value={curSearchMode}
					onValueChange={value => onSearchModeChange(value as SearchMode)}
				/>
			</div>
			<div
				role='tablist'
				className='hidden rounded-xl bg-white p-4 md:flex md:items-center md:justify-between'
			>
				{Object.entries(SEARCH_MODE_MAP).map(([searchModeId, searchMode]) => {
					const isActive = curSearchMode === searchModeId;
					return (
						<Button
							key={searchModeId}
							role='tab'
							aria-controls='search-form-panel'
							aria-selected={isActive}
							color='info'
							variant={isActive ? 'contained' : 'text'}
							onClick={() => onSearchModeChange(searchModeId as SearchMode)}
						>
							{searchMode.name}
						</Button>
					);
				})}
			</div>
			<div id='search-form-panel' role='tabpanel' className='contents md:block'>
				{curSearchMode === 'SAVED_RESULTS' ? (
					<MySavedResults />
				) : (
					<>
						<p className='font-bold'>{`Results shown will be from ${getCurrentSearchModeInfo()}.`}</p>
						<SearchForm
							searchMode={curSearchMode}
							appSourceList={appSourceList}
							sourceListBySlant={sourceListBySlant}
						/>
					</>
				)}
			</div>
		</div>
	);
};

export default SearchTabs;
