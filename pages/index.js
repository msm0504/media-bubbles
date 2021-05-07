import { Dropdown, Nav } from 'react-bootstrap';

import SearchForm from '../client/components/search-form/search-form';
import MySavedResults from '../client/components/save-results/my-saved-results';
import SEARCH_MODE, { SEARCH_MODE_MAP } from '../client/constants/search-mode';
import useLocalStorage from '../client/hooks/use-local-storage';
import { getSourceLists } from '../server/services/source-list-service';

const SECONDS_IN_WEEK = 60 * 60 * 24 * 7;

const SearchTabs = ({ appSourceList, sourceListBySlant }) => {
	const [curSearchMode, setSearchMode] = useLocalStorage('searchMode', SEARCH_MODE[0].id);

	const onSearchModeChange = searchModeId => {
		setSearchMode(searchModeId);
	};

	const generateTab = searchMode => {
		const isActive = curSearchMode === searchMode.id;
		return (
			<Nav.Item key={searchMode.id + 'Tab'}>
				<Nav.Link
					active={isActive}
					onSelect={() => onSearchModeChange(searchMode.id)}
					href='#'
					className={isActive ? 'bg-info' : 'text-info'}
				>
					<strong>{searchMode.name}</strong>
				</Nav.Link>
			</Nav.Item>
		);
	};

	const generateOption = searchMode => {
		return (
			<Dropdown.Item
				key={searchMode.id + 'Option'}
				onClick={() => onSearchModeChange(searchMode.id)}
			>
				{searchMode.name}
			</Dropdown.Item>
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
				<Nav variant='pills' fill>
					{tabsAndOptions.tabList}
				</Nav>
			</div>
			<div className='d-block d-md-none'>
				<Dropdown size='lg'>
					<Dropdown.Toggle id='search-mode-select' size='lg' variant='info'>
						{SEARCH_MODE_MAP[curSearchMode].name}
					</Dropdown.Toggle>
					<Dropdown.Menu className='w-100 text-center'>{tabsAndOptions.optionList}</Dropdown.Menu>
				</Dropdown>
			</div>
			{curSearchMode === 'SAVED_RESULTS' ? (
				<MySavedResults />
			) : (
				<>
					<p className='mt-3 ms-3'>
						<strong>{`Results shown will be from ${getCurrentSearchModeInfo()}.`}</strong>
					</p>
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

export async function getStaticProps() {
	const { appSourceList, sourceListBySlant } = await getSourceLists();
	return {
		props: {
			appSourceList,
			sourceListBySlant
		},
		revalidate: SECONDS_IN_WEEK
	};
}
