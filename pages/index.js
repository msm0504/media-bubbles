import { connect } from 'react-redux';
import {
	DropdownItem,
	DropdownMenu,
	DropdownToggle,
	Nav,
	NavItem,
	NavLink,
	UncontrolledDropdown
} from 'reactstrap';

import UIActions from '../client/actions/ui-actions';
import SearchForm from '../client/components/search-form/search-form';
import MySavedResults from '../client/components/save-results/my-saved-results';
import SEARCH_MODE, { SEARCH_MODE_MAP } from '../client/constants/search-mode';

const mapStateToProps = state => {
	return {
		curSearchMode: state.formDataState.searchMode
	};
};

const mapDispatchToProps = {
	onSearchModeChange: UIActions.formFieldChanged
};

const SearchTabs = ({ curSearchMode, onSearchModeChange }) => {
	const generateTab = searchMode => {
		const isActive = curSearchMode === searchMode.id;
		return (
			<NavItem key={searchMode.id + 'Tab'}>
				<NavLink
					active={isActive}
					onClick={() => onSearchModeChange('searchMode', searchMode.id)}
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
				onClick={() => onSearchModeChange('searchMode', searchMode.id)}
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
					<SearchForm />
				</>
			)}
		</>
	);
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchTabs);
