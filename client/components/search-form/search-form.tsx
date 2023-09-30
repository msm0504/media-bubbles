import { useState, useReducer, useContext, useEffect, ChangeEvent } from 'react';
import { Button, Card, Form, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faSpinner } from '@fortawesome/free-solid-svg-icons';

import * as ACTION_TYPES from './action-types';
import FullSpectrum from './full-spectrum';
import SearchInstructions from './instructions';
import searchFormReducer, { initialState, FieldValue } from './search-form-reducer';
import SlantRadioButtons from './slant-radio-buttons';
import SourceCheckboxes from './source-checkboxes';
import { SearchMode } from '@/client/constants/search-mode';
import { AlertsDispatch } from '@/client/contexts/alerts-context';
import { SearchResultContext } from '@/client/contexts/search-result-context';
import performSearch from '@/client/util/perform-search';
import type { Source } from '@/types';

import styles from '@/styles/search-form.module.css';

type SearchFormProps = {
	searchMode: SearchMode;
	appSourceList: Source[];
	sourceListBySlant: Source[][];
};

const SearchForm: React.FC<SearchFormProps> = ({
	searchMode,
	appSourceList,
	sourceListBySlant
}) => {
	const [formData, dispatch] = useReducer(searchFormReducer, initialState);
	const [isSearching, setSearching] = useState<boolean>(false);
	const [context, setContext] = useContext(SearchResultContext);
	const showAlert = useContext(AlertsDispatch);

	useEffect(() => {
		dispatch({ type: ACTION_TYPES.LOAD_LOCAL_STORAGE });
	}, []);

	const onFormFieldChange = (fieldName: string, value: FieldValue) =>
		dispatch({ type: ACTION_TYPES.FORM_FIELD_CHANGED, payload: { fieldName, value } });

	const checkboxChanged = (event: ChangeEvent<HTMLInputElement>, sourceId: string) => {
		if (event.target.checked) {
			dispatch({ type: ACTION_TYPES.SOURCE_SELECTED, payload: { sourceId } });
		} else {
			dispatch({ type: ACTION_TYPES.SOURCE_UNSELECTED, payload: { sourceId } });
		}
	};

	const searchTriggered = () =>
		performSearch(
			{ ...formData, searchMode },
			appSourceList,
			sourceListBySlant,
			setContext,
			showAlert,
			setSearching
		);

	const generateFormBySearchMode = () => {
		switch (searchMode) {
			case 'MY_BUBBLE':
			case 'BUBBLE_BURST':
				return <SlantRadioButtons selection={formData.sourceSlant} onChange={onFormFieldChange} />;

			case 'FULL_SPECTRUM':
				return (
					<FullSpectrum
						spectrumSearchAll={formData.spectrumSearchAll}
						onChange={onFormFieldChange}
					/>
				);

			case 'USER_SELECT':
				return (
					<SourceCheckboxes
						sourceList={appSourceList}
						selections={formData.selectedSourceIds}
						onChange={checkboxChanged}
					/>
				);

			default:
				return <div></div>;
		}
	};

	return (
		<>
			<Form>
				<Card.Body className='bg-white rounded-3 mb-3'>
					<Form.Group className='row my-3 mx-0 align-items-center'>
						<Form.Label className='col-sm-2' htmlFor='keyword'>
							<strong>Key Words:</strong>
							<OverlayTrigger
								placement='top'
								overlay={
									<Tooltip id='keyword-tooltip'>
										{'If no key words are entered, top headlines will be returned for each source.'}
									</Tooltip>
								}
							>
								<FontAwesomeIcon icon={faInfoCircle} aria-label='keyword tooltip' />
							</OverlayTrigger>
							<span className='sr-only'>
								{'If no key words are entered, top headlines will be returned for each source.'}
							</span>
						</Form.Label>
						<div className='col-sm-8'>
							<Form.Control
								type='text'
								name='keyword'
								id='keyword'
								value={formData.keyword}
								onChange={event => onFormFieldChange(event.target.name, event.target.value)}
							/>
						</div>
					</Form.Group>
					{formData.keyword && (
						<Form.Group className='row mx-0 mb-3'>
							<Form.Label htmlFor='previousDays' className='col-sm-6 col-md-4 col-lg-2'>
								<strong>Search Past {formData.previousDays} Day(s)</strong>
							</Form.Label>
							<input
								type='range'
								id='previousDays'
								name='previousDays'
								className={`${styles.range} col-sm-6 col-lg-4 mt-1`}
								min='1'
								max='7'
								step='1'
								value={formData.previousDays}
								onChange={event => onFormFieldChange(event.target.name, event.target.value)}
							/>
						</Form.Group>
					)}
				</Card.Body>
				{generateFormBySearchMode()}
				<Card.Body>
					<Button
						variant='primary'
						size='lg'
						name='getHeadlines'
						id='getHeadlines'
						disabled={isSearching}
						onClick={searchTriggered}
					>
						<strong>Get Headlines</strong>
						{isSearching && <FontAwesomeIcon className='ms-2' icon={faSpinner} pulse />}
					</Button>
				</Card.Body>
			</Form>
			<SearchInstructions />
		</>
	);
};

export default SearchForm;
