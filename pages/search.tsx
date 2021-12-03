import { GetStaticProps } from 'next';
import Head from 'next/head';
import { Dropdown, Nav } from 'react-bootstrap';

import SearchForm from '../client/components/search-form/search-form';
import MySavedResults from '../client/components/save-results/my-saved-results';
import { SEARCH_MODE_MAP, SearchMode } from '../client/constants/search-mode';
import useLocalStorage from '../client/hooks/use-local-storage';
import { keys } from '../client/util/typed-keys';
import { getSourceLists } from '../server/services/source-list-service';
import { Source } from '../types';

const SECONDS_IN_WEEK = 60 * 60 * 24 * 7;

type SearchTabsProps = {
	appSourceList: Source[];
	sourceListBySlant: Source[][];
};

const SearchTabs: React.FC<SearchTabsProps> = ({ appSourceList, sourceListBySlant }) => {
	const [curSearchMode, setSearchMode] = useLocalStorage<SearchMode>(
		'searchMode',
		keys(SEARCH_MODE_MAP)[0]
	);

	const onSearchModeChange = (searchModeId: SearchMode) => {
		setSearchMode(searchModeId);
	};

	const generateTab = (id: SearchMode, name: string) => {
		const isActive = curSearchMode === id;
		return (
			<Nav.Item key={id + 'Tab'}>
				<Nav.Link
					active={isActive}
					onClick={() => onSearchModeChange(id)}
					href='#'
					className={isActive ? 'bg-info' : 'text-info'}
				>
					<strong>{name}</strong>
				</Nav.Link>
			</Nav.Item>
		);
	};

	const generateOption = (id: SearchMode, name: string) => {
		return (
			<Dropdown.Item
				key={id + 'Option'}
				className='text-center'
				onClick={() => onSearchModeChange(id)}
			>
				{name}
			</Dropdown.Item>
		);
	};

	const getTabsAndOptions = () => {
		const tabList: JSX.Element[] = [];
		const optionList: JSX.Element[] = [];

		Object.keys(SEARCH_MODE_MAP).forEach((id: SearchMode) => {
			tabList.push(generateTab(id, SEARCH_MODE_MAP[id].name));
			optionList.push(generateOption(id, SEARCH_MODE_MAP[id].name));
		});

		return { tabList: tabList, optionList: optionList };
	};

	const getCurrentSearchModeInfo = () => SEARCH_MODE_MAP[curSearchMode].description;

	const tabsAndOptions = getTabsAndOptions();
	return (
		<>
			<Head>
				<title key='title'>Search - Media Bubbles</title>
				<link rel='canonical' href={`${process.env.NEXT_PUBLIC_URL}/search`} key='canonical' />
			</Head>
			<h1 className='text-info'>Headlines Search</h1>
			<div className='d-none d-md-block'>
				<Nav variant='pills' fill>
					{tabsAndOptions.tabList}
				</Nav>
			</div>
			<div className='d-block d-md-none'>
				<Dropdown>
					<Dropdown.Toggle className='w-100' id='search-mode-select' size='lg' variant='info'>
						{SEARCH_MODE_MAP[curSearchMode].name}
					</Dropdown.Toggle>
					<Dropdown.Menu className='w-100'>{tabsAndOptions.optionList}</Dropdown.Menu>
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

export const getStaticProps: GetStaticProps = async () => {
	const { appSourceList, sourceListBySlant } = await getSourceLists();
	return {
		props: {
			appSourceList,
			sourceListBySlant
		},
		revalidate: SECONDS_IN_WEEK
	};
};
