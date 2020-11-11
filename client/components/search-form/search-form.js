import { connect } from 'react-redux';
import {
	Button,
	CardBody,
	CardFooter,
	Form,
	FormGroup,
	Input,
	Label,
	UncontrolledTooltip
} from 'reactstrap';

import MAX_SOURCE_SELECTIONS from '../../constants/max-source-selections';
import { SOURCE_SLANT } from '../../constants/source-slant';
import UIActions from '../../actions/ui-actions';
import APIActions from '../../actions/api-actions';

const mapStateToProps = state => {
	return {
		sourceState: state.sourceState,
		formState: state.formDataState
	};
};

const mapDispatchToProps = {
	getSourceLists: APIActions.getSourceLists,
	onFormFieldChange: UIActions.formFieldChanged,
	onSourceSelect: UIActions.sourceSelected,
	onSourceUnselect: UIActions.sourceUnselected,
	submitForm: UIActions.searchFormSubmit
};

const SearchForm = ({
	formState,
	getSourceLists,
	onFormFieldChange,
	onSourceSelect,
	onSourceUnselect,
	sourceState,
	submitForm
}) => {
	if (!(sourceState.appSourceList.length && sourceState.sourceListBySlant.length)) {
		getSourceLists();
	}

	const generateFormBySearchMode = () => {
		switch (formState.searchMode) {
			case 'MY_BUBBLE':
				return (
					<div>
						<p>
							<strong>Choose the category that you think best fits your political views.</strong>
						</p>
						<div className='row'>{sourceSlantRadioList}</div>
					</div>
				);

			case 'BUBBLE_BURST':
				return (
					<div>
						<p>
							<strong>Choose the category that you think best fits your political views.</strong>
						</p>
						<div className='row'>{sourceSlantRadioList}</div>
					</div>
				);

			case 'FULL_SPECTRUM':
				return (
					<FormGroup className='row'>
						<Input
							type='checkbox'
							name='spectrumSearchAll'
							id='spectrumSearchAll'
							className='switch'
							checked={formState.spectrumSearchAll === 'Y'}
							onChange={event =>
								onFormFieldChange(event.target.name, event.target.checked ? 'Y' : 'N')
							}
						/>
						<Label for='spectrumSearchAll' className='col-lg-6'>
							<strong className='ml-2'>Include Multiple Sources In Each Category</strong>
						</Label>
					</FormGroup>
				);

			case 'USER_SELECT':
				return (
					<div>
						<p>
							<strong>Choose up to {MAX_SOURCE_SELECTIONS} sources.</strong>
						</p>
						<div className='row'>{sourceCheckboxList}</div>
					</div>
				);

			default:
				return <div></div>;
		}
	};

	const sourceSlantRadioList = SOURCE_SLANT.map(sourceSlant => {
		return (
			<FormGroup key={'sourceSlant' + sourceSlant.id} className='col-xs-1 col-md-2'>
				<Input
					type='radio'
					value={sourceSlant.id}
					name='sourceSlant'
					id={'sourceSlant' + sourceSlant.id}
					checked={sourceSlant.id === formState.sourceSlant}
					onChange={event => onFormFieldChange(event.target.name, sourceSlant.id)}
				/>
				<Label for={'sourceSlant' + sourceSlant.id}>
					<strong>{sourceSlant.name}</strong>
				</Label>
			</FormGroup>
		);
	});

	const sourceCheckboxList = sourceState.appSourceList.map(source => {
		return (
			<FormGroup key={source.id + 'Checkbox'} className='col-xs-1 col-md-2'>
				<Input
					type='checkbox'
					value={source.id}
					name={source.id + 'Checkbox'}
					id={source.id + 'Checkbox'}
					checked={formState.selectedSourceIds.indexOf(source.id) > -1}
					disabled={
						formState.selectedSourceIds.indexOf(source.id) === -1 &&
						formState.selectedSourceIds.length === MAX_SOURCE_SELECTIONS
					}
					onChange={event => checkboxChanged(event, source.id)}
				/>
				<Label for={source.id + 'Checkbox'}>
					<strong>{source.name}</strong>
				</Label>
			</FormGroup>
		);
	});

	const checkboxChanged = (event, sourceId) => {
		if (event.target.checked) {
			onSourceSelect(sourceId);
		} else {
			onSourceUnselect(sourceId);
		}
	};

	return (
		<Form className='fluid-container'>
			<CardBody>
				<FormGroup className='row'>
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
							value={formState.keyword}
							onChange={event => onFormFieldChange(event.target.name, event.target.value)}
						/>
					</div>
				</FormGroup>
				{formState.keyword && (
					<>
						<FormGroup className='row'>
							<Input
								type='checkbox'
								name='onlySearchTitles'
								id='onlySearchTitles'
								className='switch'
								checked={formState.onlySearchTitles === 'Y'}
								onChange={event =>
									onFormFieldChange(event.target.name, event.target.checked ? 'Y' : 'N')
								}
							/>
							<Label for='onlySearchTitles' className='col-lg-4'>
								<strong className='ml-2'>Only Search for Keyword in Headlines</strong>
							</Label>
						</FormGroup>
						<FormGroup className='row'>
							<Label for='sortBy' className='col-sm-6 col-md-4 col-lg-2'>
								<strong>Sort Results By:</strong>
							</Label>
							<Input
								type='select'
								name='sortBy'
								id='sortBy'
								bsSize='sm'
								className='col-sm-6 col-lg-4'
								value={formState.sortBy}
								onChange={event => onFormFieldChange(event.target.name, event.target.value)}
							>
								<option value='relevancy'>Relevance</option>
								<option value='publishedAt'>Publish Date</option>
							</Input>
						</FormGroup>
						<FormGroup className='row'>
							<Label for='sortBy' className='col-sm-6 col-md-4 col-lg-2'>
								<strong>Search Past {formState.previousDays} Day(s)</strong>
							</Label>
							<input
								type='range'
								id='previousDays'
								name='previousDays'
								className='col-sm-6 col-lg-4 mt-1'
								min='1'
								max='7'
								step='1'
								value={formState.previousDays}
								onChange={event => onFormFieldChange(event.target.name, event.target.value)}
							/>
						</FormGroup>
					</>
				)}
			</CardBody>
			<CardBody>{generateFormBySearchMode()}</CardBody>
			<CardFooter>
				<Button
					color='info'
					size='lg'
					name='getHeadlines'
					id='getHeadlines'
					onClick={() => submitForm(formState)}
				>
					<strong>Get Headlines</strong>
				</Button>
			</CardFooter>
		</Form>
	);
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchForm);
