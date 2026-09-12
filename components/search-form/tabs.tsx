'use client';
import { useMemo } from 'react';
import SearchForm from './search-form';
import MySavedResults from '../save-results/my-saved-results';
import { Button, Paper, Select } from '../shared/base-ui';
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
		<Paper className='flex flex-col gap-4'>
			<div className='block md:hidden'>
				<Select
					className='w-full text-lg'
					color='neutral'
					variant='outlined'
					items={Object.entries(SEARCH_MODE_MAP).map(([searchModeId, searchMode]) => ({
						label: searchMode.name,
						value: searchModeId,
					}))}
					value={curSearchMode}
					onValueChange={value => onSearchModeChange(value as SearchMode)}
				/>
			</div>
			<div role='tablist' className='hidden p-4 md:flex md:items-center md:justify-between'>
				{Object.entries(SEARCH_MODE_MAP).map(([searchModeId, searchMode]) => {
					const isActive = curSearchMode === searchModeId;
					return (
						<Button
							key={searchModeId}
							role='tab'
							aria-controls='search-form-panel'
							aria-selected={isActive}
							color='neutral'
							variant={isActive ? 'outlined' : 'text'}
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
					<form className='flex flex-col gap-6'>
						<p>{`Results shown will be from ${getCurrentSearchModeInfo()}.`}</p>
						<SearchForm
							searchMode={curSearchMode}
							appSourceList={appSourceList}
							sourceListBySlant={sourceListBySlant}
						/>
					</form>
				)}
			</div>
		</Paper>
	);
};

export default SearchTabs;
