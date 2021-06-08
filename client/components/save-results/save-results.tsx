import React, { useContext } from 'react';
import { Button } from 'react-bootstrap';

import ALERT_LEVEL from '../../constants/alert-level';
import { AlertsDispatch } from '../../contexts/alerts-context';
import { SearchResultContext } from '../../contexts/search-result-context';
import { callApi } from '../../services/api-service';
import {
	ItemSavedResponse,
	SavedResult,
	SearchResult,
	SetResultContextFn,
	ShowAlertFn
} from '../../../types';

async function saveClicked(
	context: SearchResult,
	setContext: SetResultContextFn,
	showAlert: ShowAlertFn
) {
	const { sourceListToSearch, isSearchAll, articleMap, savedResultName } = context;
	const { itemId: savedResultId } = await callApi<ItemSavedResponse, SavedResult>(
		'post',
		'searchResult',
		{
			articleMap,
			isSearchAll,
			name: savedResultName,
			sourceList: sourceListToSearch.map(({ id, name, url }) => ({ id, name, url }))
		}
	);

	if (!savedResultId || typeof savedResultId !== 'string') {
		showAlert(ALERT_LEVEL.danger, 'Saving this search result failed. Please try again later.');
	} else {
		showAlert(ALERT_LEVEL.success, 'Search result saved successfully.');
		setContext({ ...context, savedResultId } as SearchResult);
	}
}

const SaveResults: React.FC = () => {
	const [context, setContext] = useContext(SearchResultContext);
	const showAlert = useContext(AlertsDispatch);

	if (context.savedResultId) return null;

	return (
		<Button
			className='mb-1 ms-3 d-inline-block'
			variant='primary'
			onClick={() => saveClicked(context, setContext, showAlert)}
		>
			<strong>Save Results</strong>
		</Button>
	);
};

export default SaveResults;
