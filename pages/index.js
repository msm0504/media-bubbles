import { useState, useEffect } from 'react';
import {
	DropdownItem,
	DropdownMenu,
	DropdownToggle,
	Nav,
	NavItem,
	NavLink,
	UncontrolledDropdown
} from 'reactstrap';

import SearchForm from '../client/components/search-form/search-form';
import MySavedResults from '../client/components/save-results/my-saved-results';
import SEARCH_MODE, { SEARCH_MODE_MAP } from '../client/constants/search-mode';
import getStateFromStorage from '../client/util/get-state-from-storage';

const SEARCH_MODE_KEY = 'searchMode';

const SearchTabs = () => {
	const [curSearchMode, setSearchMode] = useState(SEARCH_MODE[0].id);

	useEffect(() => {
		const storedValue = getStateFromStorage([{ key: SEARCH_MODE_KEY }]);
		if (storedValue[SEARCH_MODE_KEY]) {
			setSearchMode(storedValue[SEARCH_MODE_KEY]);
		}
	}, []);

	const onSearchModeChange = searchModeId => {
		localStorage.setItem(SEARCH_MODE_KEY, searchModeId);
		setSearchMode(searchModeId);
	};

	const generateTab = searchMode => {
		const isActive = curSearchMode === searchMode.id;
		return (
			<NavItem key={searchMode.id + 'Tab'}>
				<NavLink
					active={isActive}
					onClick={() => onSearchModeChange(searchMode.id)}
					href='#'
					className={isActive ? 'bg-info' : 'text-info'}
				>
					<strong>{searchMode.name}</strong>
				</NavLink>
			</NavItem>
		);
	};

	const generateOption = searchMode => {
		return (
			<DropdownItem
				key={searchMode.id + 'Option'}
				onClick={() => onSearchModeChange(searchMode.id)}
			>
				{searchMode.name}
			</DropdownItem>
		);
	};

	const getTabsAndOptions = () => {
		const tabList = [];
		const optionList = [];

		SEARCH_MODE.forEach(searchMode => {
			tabList.push(generateTab(searchMode));
			optionList.push(generateOption(searchMode));
		});

		return { tabList: tabList, optionList: optionList };
	};

	const getCurrentSearchModeInfo = () => SEARCH_MODE_MAP[curSearchMode].description;

	const tabsAndOptions = getTabsAndOptions();
	return (
		<>
			<h1 className='text-info'>Headlines Search</h1>
			<div className='d-none d-md-block'>
				<Nav pills fill>
					{tabsAndOptions.tabList}
				</Nav>
			</div>
			<div className='d-block d-md-none'>
				<UncontrolledDropdown size='lg'>
					<DropdownToggle caret block size='lg' color='info'>
						{SEARCH_MODE_MAP[curSearchMode].name}
					</DropdownToggle>
					<DropdownMenu className='w-100 text-center'>{tabsAndOptions.optionList}</DropdownMenu>
				</UncontrolledDropdown>
			</div>
			{curSearchMode === 'SAVED_RESULTS' ? (
				<MySavedResults />
			) : (
				<>
					<p className='mt-3 ml-3'>
						<strong>{`Results shown will be from ${getCurrentSearchModeInfo()}.`}</strong>
					</p>
					<SearchForm searchMode={curSearchMode} />
				</>
			)}
		</>
	);
};

export default SearchTabs;
