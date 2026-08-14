'use client';
import { useState, useReducer, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@base-ui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faSpinner } from '@fortawesome/free-solid-svg-icons';
import * as ACTION_TYPES from './action-types';
import FullSpectrum from './full-spectrum';
import searchFormReducer, { initialState, FieldValue } from './search-form-reducer';
import SlantRadioButtons from './slant-radio-buttons';
import SourceCheckboxes from './source-checkboxes';
import { Button, Popover, Slider } from '../shared/base-ui';
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

	const checkboxChanged = (checked: boolean, sourceId: string) => {
		if (checked) {
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
			<div className='flex flex-col gap-4'>
				<div className='rounded-xl bg-white p-4'>
					<div className='flex flex-col gap-4 md:flex-row'>
						<label className='flex grow flex-col items-start gap-1 font-bold'>
							<span>
								Key Words:{' '}
								<Popover
									side='top'
									description='If no key words are entered, top headlines will be returned for each source.'
								>
									<FontAwesomeIcon icon={faInfoCircle} aria-label='keyword tooltip' />
								</Popover>
							</span>
							<Input
								className='h-8 w-40 rounded-xl border border-neutral-950 bg-white px-2 text-sm font-normal text-neutral-950 placeholder:text-neutral-500 focus:outline-2 focus:-outline-offset-1 focus:outline-neutral-950 dark:border-white dark:bg-neutral-950 dark:text-white dark:placeholder:text-neutral-400 dark:focus:outline-white any-pointer-coarse:text-base'
								name='keyword'
								value={formData.keyword}
								onValueChange={(newValue, eventDetails) =>
									onFormFieldChange((eventDetails.event.target as HTMLInputElement)?.name, newValue)
								}
							/>
						</label>
						<div className='flex grow justify-center'>
							{formData.keyword ? (
								<Slider
									className='flex w-full max-w-150 items-center justify-center gap-4 font-bold'
									label={`Search Past ${formData.previousDays} Day(s)`}
									name='previousDays'
									color='info'
									min={1}
									max={7}
									step={1}
									value={formData.previousDays}
									onValueChange={(newValue, eventDetails) =>
										onFormFieldChange(
											(eventDetails.event.target as HTMLInputElement)?.name,
											newValue as number
										)
									}
								/>
							) : null}
						</div>
					</div>
				</div>
				{generateFormBySearchMode()}
				<div>
					<Button
						color='primary'
						variant='contained'
						name='getHeadlines'
						id='getHeadlines'
						disabled={isSearching}
						onClick={searchTriggered}
					>
						<strong>Get Headlines</strong>
						{isSearching && <FontAwesomeIcon className='ms-2' icon={faSpinner} spinPulse />}
					</Button>
				</div>
			</div>
		</form>
	);
};

export default SearchForm;
