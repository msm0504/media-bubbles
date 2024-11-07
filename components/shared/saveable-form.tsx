'use client';
import { useState, useEffect, FocusEvent, ReactElement } from 'react';
import {
	Box,
	Button,
	Dialog,
	DialogContent,
	DialogTitle,
	FormControl,
	FormLabel,
	Paper,
	Stack,
	TextField,
	ToggleButtonGroup,
	ToggleButton,
	Typography,
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import useInterval from '@/hooks/use-interval';
import {
	getItemFromStorage,
	setItemInStorage,
	removeItemsFromStorage,
} from '@/util/local-storage-util';

type SaveFormData<T> = {
	[prop in keyof T]: string;
};

export type FieldSetting = {
	name: string;
	type: 'text' | 'buttonGroup';
	isDisabled?: boolean;
	placeholder?: string;
	rows?: number;
	options?: { value: string; label: string }[];
};

interface SaveableFormProps<T> {
	fieldList: FieldSetting[];
	fieldValidateFn: (fieldName: string, value: string | undefined) => string;
	formName: string;
	initialData: SaveFormData<T>;
	localStorageInterval?: number;
	PreviewComponent?: React.FC<SaveFormData<T>>;
	submitFn: (formData: SaveFormData<T>) => Promise<void>;
	submitLabel: string;
}

const capitalize = (str: string) => `${str.charAt(0).toUpperCase()}${str.substring(1)}`;
const kebabCaseToTitleCase = (str: string) => str.split('-').map(capitalize).join(' ');

export const getRequiredMessage = (fieldName: string): string =>
	`${capitalize(fieldName)} is required`;

const SaveableForm = <T,>({
	fieldList,
	fieldValidateFn,
	formName,
	initialData,
	localStorageInterval = -1,
	PreviewComponent,
	submitFn,
	submitLabel,
}: SaveableFormProps<T>): ReactElement => {
	const [formData, setFormData] = useState<SaveFormData<T>>(initialData);
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [submit, setSubmit] = useState(false);
	const [isProcessing, setProcessing] = useState<boolean>(false);
	const [preview, setPreview] = useState(false);

	useEffect(() => {
		if (localStorageInterval && localStorageInterval > 0) {
			const storedFormData = getItemFromStorage({ key: formName, type: 'json' });
			if (storedFormData) {
				setFormData(storedFormData as SaveFormData<T>);
			}
		}
	}, []);

	useInterval(
		() => setItemInStorage({ key: formName, value: formData }),
		// stop local storage backup when form has been submitted
		submit ? -1 : localStorageInterval
	);

	useEffect(() => {
		if (submit && !Object.keys(errors).length) {
			if (localStorageInterval && localStorageInterval > 0) {
				removeItemsFromStorage([formName]);
			}
			setProcessing(true);
			submitFn(formData).then(() => setProcessing(false));
		}
		setSubmit(false);
	}, [errors]);

	const hasPreview = !!PreviewComponent;
	const togglePreview = () => setPreview(!preview);

	const fieldChanged = (name: string, value: string) => {
		setFormData({
			...formData,
			[name]: value,
		});
	};

	const updateFieldError = (event: FocusEvent<HTMLInputElement>) => {
		const {
			target: { name: fieldName, value },
		} = event;
		const error = fieldValidateFn(fieldName, value);

		if (error && errors[fieldName] !== error) {
			setErrors({ ...errors, [fieldName]: error });
		} else if (!error && errors[fieldName]) {
			const { [fieldName]: oldError, ...remainingErrors } = errors;
			setErrors(remainingErrors);
		}
	};

	const updateFormErrors = () => {
		setErrors(
			Object.keys(formData).reduce((acc: Record<string, string>, fieldName: string) => {
				const error = fieldValidateFn(fieldName, formData[fieldName as keyof T]);
				if (error) acc[fieldName] = error;
				return acc;
			}, {})
		);
	};

	const submitClicked = () => {
		setSubmit(true);
		updateFormErrors();
	};

	const generateFormField = (fieldSettings: FieldSetting) => {
		return fieldSettings.type === 'buttonGroup'
			? generateButtonGroup(fieldSettings)
			: generateTextField(fieldSettings);
	};

	const generateTextField = ({ name, placeholder, isDisabled, rows }: FieldSetting) => (
		<Paper key={name}>
			<TextField
				name={name}
				fullWidth
				id={`${formName}-${name}`}
				label={<Typography fontWeight='bold'>{capitalize(name)}</Typography>}
				placeholder={placeholder}
				disabled={isDisabled}
				value={formData[name as keyof T]}
				onChange={event => fieldChanged(event.target.name, event.target.value)}
				onBlur={updateFieldError}
				error={!!errors[name]}
				helperText={errors[name] || ' '}
				multiline={!!rows}
				minRows={rows}
			/>
		</Paper>
	);

	const generateButtonGroup = ({ name, options }: FieldSetting) => (
		<FormControl key={name} margin='none'>
			<FormLabel id={`${formName}-${name}-label`}>
				<Typography fontWeight='bold'>{capitalize(name)}</Typography>
			</FormLabel>
			<ToggleButtonGroup
				value={formData[name as keyof T]}
				onChange={(_event, value) => fieldChanged(name, value)}
				exclusive
				color='info'
				size='large'
				aria-labelledby={`${formName}-${name}-label`}
			>
				{options?.map(({ value, label }) => (
					<ToggleButton key={value} value={value}>
						{label}
					</ToggleButton>
				))}
			</ToggleButtonGroup>
		</FormControl>
	);

	return (
		<>
			{hasPreview && PreviewComponent && (
				<>
					<Dialog open={preview} onClose={togglePreview} fullWidth maxWidth='lg'>
						<DialogTitle>{`Preview ${kebabCaseToTitleCase(formName)}`}</DialogTitle>
						<DialogContent>
							<PreviewComponent {...formData} />
						</DialogContent>
					</Dialog>
					<Stack direction='row-reverse'>
						<Button color='info' onClick={() => setPreview(true)}>
							<strong>Preview</strong>
						</Button>
					</Stack>
				</>
			)}
			<form>
				<Stack spacing={4}>
					{fieldList.map(generateFormField)}
					<Box>
						<Button
							variant='contained'
							color='primary'
							size='large'
							name={`submit-${formName}`}
							id={`submit-${formName}`}
							disabled={isProcessing}
							onClick={submitClicked}
							endIcon={isProcessing && <FontAwesomeIcon className='ms-2' icon={faSpinner} pulse />}
						>
							<strong>{submitLabel}</strong>
						</Button>
					</Box>
				</Stack>
			</form>
		</>
	);
};

export default SaveableForm;
