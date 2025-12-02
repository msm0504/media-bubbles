'use client';
import { useState, useContext, useMemo } from 'react';
import { Button } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

import ALERT_LEVEL from '@/constants/alert-level';
import { AlertsDispatch } from '@/contexts/alerts-context';
import { SearchResultContext } from '@/contexts/search-result-context';
import { callApi } from '@/services/api-service';
import type { ItemSavedResponse, SavedResult, SearchResult } from '@/types';

const SaveResults: React.FC = () => {
	const [isSaving, setSaving] = useState<boolean>(false);
	const [context, setContext] = useContext(SearchResultContext);
	const showAlert = useContext(AlertsDispatch);

	const saveClicked = useMemo(
		() => async () => {
			setSaving(true);
			const { sourceListToSearch, isSearchAll, articleMap, savedResultName } = context;
			const data = {
				articleMap,
				isSearchAll,
				name: savedResultName,
				sourceList: sourceListToSearch,
			};

			const { itemId: savedResultId } = await callApi<ItemSavedResponse, SavedResult>(
				'post',
				'search-result',
				data
			);

			if (!savedResultId || typeof savedResultId !== 'string') {
				showAlert(ALERT_LEVEL.warning, 'Saving this search result failed. Please try again later.');
			} else {
				showAlert(ALERT_LEVEL.success, 'Search result saved successfully.');
				setContext({ ...context, savedResultId } as SearchResult);
			}
			setSaving(false);
		},
		[context, setContext, setSaving, showAlert]
	);

	if (context.savedResultId) return null;

	return (
		<Button
			id='save-results'
			color='primary'
			variant='contained'
			disabled={isSaving}
			onClick={saveClicked}
			endIcon={isSaving && <FontAwesomeIcon className='ms-2' icon={faSpinner} spinPulse />}
		>
			<strong>Save Results</strong>
		</Button>
	);
};

export default SaveResults;
