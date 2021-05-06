import { useReducer, useContext, useEffect } from 'react';
import { Button, CardBody, Form, FormGroup, Input, Label, UncontrolledTooltip } from 'reactstrap';

import searchFormReducer, { ACTION_TYPES, initialState } from './search-form-reducer';
import SlantRadioButtons from './slant-radio-buttons';
import SourceCheckboxes from './source-checkboxes';
import { AlertsDispatch } from '../../contexts/alerts-context';
import { SearchResultContext } from '../../contexts/search-result-context';
import performSearch from '../../util/perform-search';

const SearchForm = ({ searchMode, appSourceList, sourceListBySlant }) => {
	const [formData, dispatch] = useReducer(searchFormReducer, initialState);
	// eslint-disable-next-line no-unused-vars
	const [context, setContext] = useContext(SearchResultContext);
	const showAlert = useContext(AlertsDispatch);

	useEffect(() => {
		dispatch({ type: ACTION_TYPES.LOAD_LOCAL_STORAGE });
	}, []);

	const onFormFieldChange = (fieldName, value) =>
		dispatch({ type: ACTION_TYPES.FORM_FIELD_CHANGED, payload: { fieldName, value } });

	const checkboxChanged = (event, sourceId) => {
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
			showAlert
		);

	const generateFormBySearchMode = () => {
		switch (searchMode) {
			case 'MY_BUBBLE':
			case 'BUBBLE_BURST':
				return <SlantRadioButtons selection={formData.sourceSlant} onChange={onFormFieldChange} />;

			case 'FULL_SPECTRUM':
				return (
					<CardBody className='bg-white rounded-xl my-3'>
						<FormGroup className='row m-0'>
							<Input
								type='checkbox'
								name='spectrumSearchAll'
								id='spectrumSearchAll'
								className='switch'
								checked={formData.spectrumSearchAll === 'Y'}
								onChange={event =>
									onFormFieldChange(event.target.name, event.target.checked ? 'Y' : 'N')
								}
							/>
							<Label for='spectrumSearchAll' className='col-lg-6'>
								<strong className='ml-2'>Include Multiple Sources In Each Category</strong>
							</Label>
						</FormGroup>
					</CardBody>
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
		<Form>
			<CardBody className='bg-white rounded-xl mb-3'>
				<FormGroup className='row mt-3 mx-0'>
					<Label className='col-sm-2' for='keyword'>
						<strong>Key Words:</strong>
						<i
							className='fa fa-info-circle'
							id='keyword-tooltip'
							aria-hidden='true'
							aria-label='Tooltip'
						></i>
						<UncontrolledTooltip placement='top' target='keyword-tooltip'>
							{'If no key words are entered, top headlines will be returned for each source.'}
						</UncontrolledTooltip>
						<span className='sr-only'>
							{'If no key words are entered, top headlines will be returned for each source.'}
						</span>
					</Label>
					<div className='col-sm-8'>
						<Input
							type='text'
							name='keyword'
							id='keyword'
							value={formData.keyword}
							onChange={event => onFormFieldChange(event.target.name, event.target.value)}
						/>
					</div>
				</FormGroup>
				{formData.keyword && (
					<FormGroup className='row mx-0'>
						<Label for='previousDays' className='col-sm-6 col-md-4 col-lg-2'>
							<strong>Search Past {formData.previousDays} Day(s)</strong>
						</Label>
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
					</FormGroup>
				)}
			</CardBody>
			{generateFormBySearchMode()}
			<CardBody>
				<Button
					color='primary'
					size='lg'
					name='getHeadlines'
					id='getHeadlines'
					onClick={searchTriggered}
				>
					<strong>Get Headlines</strong>
				</Button>
			</CardBody>
		</Form>
	);
};

export default SearchForm;
