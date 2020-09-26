import { connect } from 'react-redux';
import { Button } from 'reactstrap';

import UIActions from '../../actions/ui-actions';
import { SEARCH_MODE_MAP } from '../../constants/search-mode';
import { SOURCE_SLANT_MAP } from '../../constants/source-slant';

const mapStateToProps = state => ({
	formState: state.formDataState,
	newSearchState: state.searchResultState.newSearch,
	sourceState: state.sourceState
});

const mapDispatchToProps = {
	saveResult: UIActions.saveResult
};

const SaveResults = ({ formState, newSearchState, saveResult, sourceState }) => {
	if (newSearchState.savedResultId) return null;

	const name = `${formState.keyword ? formState.keyword : 'Headlines'} ${
		SEARCH_MODE_MAP[formState.searchMode].name
	}${
		formState.sourceSlant && formState.searchMode.includes('BUBBLE')
			? ` (${SOURCE_SLANT_MAP[formState.sourceSlant]})`
			: ''
	}`;

	const savedClicked = () => {
		saveResult(
			name,
			newSearchState.articleMap,
			newSearchState.isSearchAll,
			newSearchState.isSearchAll
				? []
				: sourceState.sourceListToSearch.map(({ id, name, url }) => ({ id, name, url }))
		);
	};

	return (
		<Button
			className='ml-3 d-inline-block'
			outline
			color='primary'
			size='lg'
			onClick={() => savedClicked()}
		>
			<strong>Save Results</strong>
		</Button>
	);
};

export default connect(mapStateToProps, mapDispatchToProps)(SaveResults);
