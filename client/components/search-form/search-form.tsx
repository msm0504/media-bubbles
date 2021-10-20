import { useState, useReducer, useContext, useEffect, ChangeEvent } from 'react';
import { Button, Card, Form, OverlayTrigger, Tooltip } from 'react-bootstrap';

import * as ACTION_TYPES from './action-types';
import SearchInstructions from './instructions';
import searchFormReducer, { initialState, FieldValue } from './search-form-reducer';
import SlantRadioButtons from './slant-radio-buttons';
import SourceCheckboxes from './source-checkboxes';
import { SearchMode } from '../../constants/search-mode';
import { AlertsDispatch } from '../../contexts/alerts-context';
import { SearchResultContext } from '../../contexts/search-result-context';
import performSearch from '../../util/perform-search';
import { Source } from '../../../types';

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
					<Card.Body className='bg-white rounded-xl my-3'>
						<Form.Check className='row m-0'>
							<Form.Check.Input
								type='checkbox'
								name='spectrumSearchAll'
								id='spectrumSearchAll'
								className='switch'
								checked={formData.spectrumSearchAll === 'Y'}
								onChange={(event: ChangeEvent<HTMLInputElement>) =>
									onFormFieldChange(event.target.name, event.target.checked ? 'Y' : 'N')
								}
							/>
							<Form.Check.Label htmlFor='spectrumSearchAll' className='col-lg-6'>
								<strong className='ms-2'>Include Multiple Sources in Each Category</strong>
							</Form.Check.Label>
						</Form.Check>
					</Card.Body>
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
				<Card.Body className='bg-white rounded-xl mb-3'>
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
								<i
									className='fa fa-info-circle'
									aria-hidden='true'
									aria-label='keyword tooltip'
								></i>
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
								className='col-sm-6 col-lg-4 mt-1'
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
						{isSearching && <i className='fa fa-spinner fa-pulse ms-2' aria-hidden='true'></i>}
					</Button>
				</Card.Body>
			</Form>
			<SearchInstructions />
		</>
	);
};

export default SearchForm;
