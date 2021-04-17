import { connect } from 'react-redux';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

import Column from './column';
import SaveResults from '../save-results/save-results';
import UIActions from '../../actions/ui-actions';
import { SOURCE_SLANT } from '../../constants/source-slant';
const ShareButtons = dynamic(() => import('../save-results/share-buttons'), { ssr: false });

const mapStateToProps = state => {
	return {
		sourceListToSearch: state.sourceState.sourceListToSearch,
		searchResultState: state.searchResultState
	};
};

const mapDispatchToProps = {
	onPanelOpen: UIActions.panelOpened,
	onPanelClose: UIActions.panelClosed
};

const SearchResults = ({ onPanelClose, onPanelOpen, searchResultState, sourceListToSearch }) => {
	const router = useRouter();
	const { resultId } = router.query;
	const stateToDisplayName = resultId ? 'loadedResult' : 'newSearch';
	const stateToDisplay = searchResultState[stateToDisplayName];
	const { isSearchAll } = stateToDisplay;

	if (resultId && resultId !== stateToDisplay.savedResultId) return null;

	const togglePanel = columnId => {
		if (stateToDisplay.openPanels.indexOf(columnId) === -1) {
			onPanelOpen(columnId, stateToDisplayName);
		} else {
			onPanelClose(columnId, stateToDisplayName);
		}
	};

	const isPanelInOpenList = columnId => {
		return stateToDisplay.openPanels.indexOf(columnId) !== -1;
	};

	const generateColumns = () => {
		const columns = isSearchAll
			? SOURCE_SLANT
			: resultId
			? stateToDisplay.sourceList
			: sourceListToSearch;

		return columns.map(column => (
			<Column
				key={`${column.id}Column`}
				column={column}
				articles={stateToDisplay.articleMap[column.id]}
				isSearchAll={isSearchAll}
				togglePanel={togglePanel}
				isPanelInOpenList={isPanelInOpenList(column.id)}
			/>
		));
	};

	const displayShareButtons = () => {
		const currentUrl = `${process.env.NEXT_PUBLIC_API_URL}${router.asPath}`;
		const urlToShare = resultId
			? currentUrl
			: stateToDisplay.savedResultId
			? `${currentUrl}/${stateToDisplay.savedResultId}`
			: '';
		return <ShareButtons urlToShare={urlToShare} />;
	};

	return (
		<>
			{!resultId && <SaveResults />}
			{displayShareButtons()}
			<div className='d-flex flex-wrap flex-column flex-xl-row align-items-stretch align-items-xl-start justify-content-xl-around'>
				{generateColumns()}
			</div>
		</>
	);
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchResults);
