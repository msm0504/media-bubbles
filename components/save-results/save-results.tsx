'use client';
import { useState, useContext, MutableRefObject } from 'react';
import { Button } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import html2canvas from 'html2canvas';
import FormData from 'form-data';

import ALERT_LEVEL from '@/constants/alert-level';
import { AlertsDispatch } from '@/contexts/alerts-context';
import { SearchResultContext } from '@/contexts/search-result-context';
import { callApiMultipart } from '@/services/api-service';
import type { ItemSavedResponse, SearchResult, SetResultContextFn, ShowAlertFn } from '@/types';

type SaveResultsProps = {
	container?: MutableRefObject<HTMLDivElement | null>;
};

const saveClicked = async (
	context: SearchResult,
	setContext: SetResultContextFn,
	showAlert: ShowAlertFn,
	setSaving: React.Dispatch<React.SetStateAction<boolean>>,
	container: HTMLDivElement | null
) => {
	setSaving(true);
	const { sourceListToSearch, isSearchAll, articleMap, savedResultName } = context;
	const form = new FormData();
	form.append(
		'result',
		JSON.stringify({
			articleMap,
			isSearchAll,
			name: savedResultName,
			sourceList: sourceListToSearch.map(({ id, name, url }) => ({ id, name, url })),
		})
	);
	if (container) {
		const canvas = await html2canvas(container, {
			windowWidth: 1200,
			windowHeight: 720,
			height: 630,
			onclone: (document, element) =>
				element.querySelectorAll('.collapse').forEach(child => child.classList.remove('collapse')),
		});
		form.append('capture', await new Promise(resolve => canvas.toBlob(resolve)));
	} else {
		form.append('capture', '');
	}

	const { itemId: savedResultId } = await callApiMultipart<ItemSavedResponse>(
		'search-result',
		form
	);

	if (!savedResultId || typeof savedResultId !== 'string') {
		showAlert(ALERT_LEVEL.warning, 'Saving this search result failed. Please try again later.');
	} else {
		showAlert(ALERT_LEVEL.success, 'Search result saved successfully.');
		setContext({ ...context, savedResultId } as SearchResult);
	}
	setSaving(false);
};

const SaveResults: React.FC<SaveResultsProps> = ({ container }) => {
	const [isSaving, setSaving] = useState<boolean>(false);
	const [context, setContext] = useContext(SearchResultContext);
	const showAlert = useContext(AlertsDispatch);

	if (context.savedResultId) return null;

	return (
		<Button
			// className='mb-1 ms-3 d-inline-block'
			id='save-results'
			color='primary'
			variant='contained'
			disabled={isSaving}
			onClick={() =>
				saveClicked(context, setContext, showAlert, setSaving, container?.current || null)
			}
			endIcon={isSaving && <FontAwesomeIcon className='ms-2' icon={faSpinner} pulse />}
		>
			<strong>Save Results</strong>
		</Button>
	);
};

export default SaveResults;
