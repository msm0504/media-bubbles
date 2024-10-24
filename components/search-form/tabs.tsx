'use client';
import { useState, useMemo } from 'react';
import { Box, Button, Menu, MenuItem, Tab, Tabs, Typography } from '@mui/material';
import SearchForm from './search-form';
import MySavedResults from '../save-results/my-saved-results';
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
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [curSearchMode, setSearchMode] = useLocalStorage<SearchMode>(
		'searchMode',
		SEARCH_MODE_IDS[0]
	);

	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const getCurrentSearchModeInfo = useMemo(
		() => () => SEARCH_MODE_MAP[curSearchMode].description,
		[curSearchMode]
	);

	const onSearchModeChange = (searchModeId: SearchMode) => {
		setSearchMode(searchModeId);
	};

	return (
		<>
			<Box display={{ xs: 'block', md: 'none' }}>
				<Button
					id='search-mode-btn'
					aria-label='search mode selection'
					aria-controls={!!anchorEl ? 'search-mode-menu' : undefined}
					aria-haspopup='true'
					aria-expanded={!!anchorEl ? 'true' : undefined}
					onClick={handleClick}
					fullWidth
					color='info'
					variant='contained'
				>
					{SEARCH_MODE_MAP[curSearchMode].name}
				</Button>
				<Menu
					id='search-mode-menu'
					anchorEl={anchorEl}
					open={!!anchorEl}
					onClose={handleClose}
					MenuListProps={{
						'aria-labelledby': 'search-mode-btn',
					}}
					anchorOrigin={{
						vertical: 'bottom',
						horizontal: 'center',
					}}
					transformOrigin={{
						vertical: 'top',
						horizontal: 'center',
					}}
				>
					{Object.entries(SEARCH_MODE_MAP).map(([searchModeId, searchMode]) => (
						<MenuItem
							key={searchModeId}
							onClick={() => {
								onSearchModeChange(searchModeId as SearchMode);
								handleClose();
							}}
						>
							{searchMode.name}
						</MenuItem>
					))}
				</Menu>
			</Box>
			<Box display={{ xs: 'none', md: 'block' }}>
				<Tabs
					centered
					aria-label='search mode selection'
					variant='fullWidth'
					value={curSearchMode}
					onChange={(_event, newValue) => onSearchModeChange(newValue)}
				>
					{Object.entries(SEARCH_MODE_MAP).map(([searchModeId, searchMode]) => (
						<Tab key={searchModeId} value={searchModeId} label={searchMode.name} />
					))}
				</Tabs>
			</Box>
			{curSearchMode === 'SAVED_RESULTS' ? (
				<MySavedResults />
			) : (
				<>
					<Typography fontWeight='bold'>{`Results shown will be from ${getCurrentSearchModeInfo()}.`}</Typography>
					<SearchForm
						searchMode={curSearchMode}
						appSourceList={appSourceList}
						sourceListBySlant={sourceListBySlant}
					/>
				</>
			)}
		</>
	);
};

export default SearchTabs;
