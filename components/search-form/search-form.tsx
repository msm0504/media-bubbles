'use client';
import { useState, useReducer, useEffect, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import {
	Box,
	Button,
	FormControlLabel,
	Paper,
	Slider,
	Stack,
	TextField,
	Tooltip,
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faSpinner } from '@fortawesome/free-solid-svg-icons';
import * as ACTION_TYPES from './action-types';
import FullSpectrum from './full-spectrum';
import searchFormReducer, { initialState, FieldValue } from './search-form-reducer';
import SlantRadioButtons from './slant-radio-buttons';
import SourceCheckboxes from './source-checkboxes';
import type { SearchMode } from '@/constants/search-mode';
import useHeadlineSearch from '@/hooks/use-headline-search';
import type { Source } from '@/types';

type SearchFormProps = {
	searchMode: SearchMode;
	appSourceList: Source[];
	sourceListBySlant: Source[][];
};

const SearchForm: React.FC<SearchFormProps> = ({
	searchMode,
	appSourceList,
	sourceListBySlant,
}) => {
	const [formData, dispatch] = useReducer(searchFormReducer, initialState);
	const [isSearching, setSearching] = useState<boolean>(false);
	const router = useRouter();
	const { performSearch, validateFormData } = useHeadlineSearch(appSourceList, sourceListBySlant);

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

	const searchTriggered = () => {
		const formDataWithMode = { ...formData, searchMode };
		if (validateFormData(formDataWithMode)) {
			setSearching(true);
			performSearch(formDataWithMode).then(() => {
				setSearching(false);
				router.push('/headlines');
			});
		}
	};

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
		<form>
			<Stack spacing={4}>
				<Paper>
					<Stack direction={{ xs: 'column', md: 'row' }} spacing={4}>
						<TextField
							name='keyword'
							sx={{ flexGrow: 1 }}
							value={formData.keyword}
							onChange={event => onFormFieldChange(event.target.name, event.target.value)}
							label={
								<>
									Key Words:
									<Tooltip
										title={
											'If no key words are entered, top headlines will be returned for each source.'
										}
										placement='top'
									>
										<FontAwesomeIcon icon={faInfoCircle} aria-label='keyword tooltip' />
									</Tooltip>
								</>
							}
						/>
						{formData.keyword ? (
							<FormControlLabel
								sx={theme => ({ flexGrow: 1, gap: theme.spacing(2) })}
								control={
									<Slider
										name='previousDays'
										min={1}
										max={7}
										step={1}
										color='info'
										sx={{ maxWidth: '600px' }}
										value={formData.previousDays}
										onChange={(_event, newValue) =>
											onFormFieldChange('previousDays', newValue as number)
										}
									/>
								}
								label={<strong>Search Past {formData.previousDays} Day(s)</strong>}
								labelPlacement='start'
							/>
						) : (
							<Box flexGrow={1}></Box>
						)}
					</Stack>
				</Paper>
				{generateFormBySearchMode()}
				<Box>
					<Button
						color='primary'
						variant='contained'
						size='large'
						name='getHeadlines'
						id='getHeadlines'
						disabled={isSearching}
						onClick={searchTriggered}
						endIcon={isSearching && <FontAwesomeIcon className='ms-2' icon={faSpinner} pulse />}
					>
						<strong>Get Headlines</strong>
					</Button>
				</Box>
			</Stack>
		</form>
	);
};

export default SearchForm;
