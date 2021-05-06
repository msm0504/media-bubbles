import { useReducer, useContext, useEffect } from 'react';
import { Button, CardBody, Form, FormGroup, Input, Label, UncontrolledTooltip } from 'reactstrap';

import searchFormReducer, { ACTION_TYPES, initialState } from './search-form-reducer';
import MAX_SOURCE_SELECTIONS from '../../constants/max-source-selections';
import { SOURCE_SLANT } from '../../constants/source-slant';
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

	const generateFormBySearchMode = () => {
		switch (searchMode) {
			case 'MY_BUBBLE':
				return (
					<>
						<p className='ml-3'>
							<strong>Choose the category that you think best fits your political views.</strong>
						</p>
						<CardBody className='bg-white rounded-xl d-flex flex-column flex-md-row justify-content-md-around'>
							{sourceSlantRadioList}
						</CardBody>
					</>
				);

			case 'BUBBLE_BURST':
				return (
					<>
						<p className='ml-3'>
							<strong>Choose the category that you think best fits your political views.</strong>
						</p>
						<CardBody className='bg-white rounded-xl d-flex flex-column flex-md-row justify-content-md-around'>
							{sourceSlantRadioList}
						</CardBody>
					</>
				);

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
					<>
						<p className='ml-3'>
							<strong>Choose up to {MAX_SOURCE_SELECTIONS} sources.</strong>
						</p>
						<CardBody className='row bg-white rounded-xl my-3 mx-0'>{sourceCheckboxList}</CardBody>
					</>
				);

			default:
				return <div></div>;
		}
	};

	const sourceSlantRadioList = SOURCE_SLANT.map(sourceSlant => {
		return (
			<FormGroup key={'sourceSlant' + sourceSlant.id} className='col-xs-1 col-md-2 m-0'>
				<Input
					type='radio'
					value={sourceSlant.id}
					name='sourceSlant'
					id={'sourceSlant' + sourceSlant.id}
					checked={sourceSlant.id === formData.sourceSlant}
					onChange={event => onFormFieldChange(event.target.name, sourceSlant.id)}
				/>
				<Label for={'sourceSlant' + sourceSlant.id}>
					<strong>{sourceSlant.name}</strong>
				</Label>
			</FormGroup>
		);
	});

	const sourceCheckboxList = appSourceList.map(source => {
		return (
			<FormGroup key={source.id + 'Checkbox'} className='col-xs-1 col-md-2'>
				<Input
					type='checkbox'
					value={source.id}
					name={source.id + 'Checkbox'}
					id={source.id + 'Checkbox'}
					checked={formData.selectedSourceIds.indexOf(source.id) > -1}
					disabled={
						formData.selectedSourceIds.indexOf(source.id) === -1 &&
						formData.selectedSourceIds.length === MAX_SOURCE_SELECTIONS
					}
					onChange={event => checkboxChanged(event, source.id)}
				/>
				<Label for={source.id + 'Checkbox'}>
					<strong>{source.name}</strong>
				</Label>
			</FormGroup>
		);
	});

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
					onClick={() =>
						performSearch(
							{ ...formData, searchMode },
							appSourceList,
							sourceListBySlant,
							setContext,
							showAlert
						)
					}
				>
					<strong>Get Headlines</strong>
				</Button>
			</CardBody>
		</Form>
	);
};

export default SearchForm;
