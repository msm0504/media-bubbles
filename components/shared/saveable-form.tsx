'use client';
import { useState, useEffect, ReactElement } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import type { DefaultValues, FieldValues, Path, RegisterOptions } from 'react-hook-form';
import {
	Box,
	Button,
	capitalize,
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

export type FieldSetting<T extends FieldValues> = {
	name: Path<T>;
	type: 'text' | 'buttonGroup';
	isDisabled?: boolean;
	options?: { value: string; label: string }[];
	placeholder?: string;
	rows?: number;
	rules?: RegisterOptions<T, Path<T>>;
};

interface SaveableFormProps<T extends FieldValues> {
	fieldList: FieldSetting<T>[];
	formName: string;
	initialData: DefaultValues<T>;
	localStorageInterval?: number;
	PreviewComponent?: React.FC<T>;
	submitFn: (formData: T) => Promise<void>;
	submitLabel: string;
}

const kebabCaseToTitleCase = (str: string) => str.split('-').map(capitalize).join(' ');

const SaveableForm = <T extends FieldValues>({
	fieldList,
	formName,
	initialData,
	localStorageInterval = -1,
	PreviewComponent,
	submitFn,
	submitLabel,
}: SaveableFormProps<T>): ReactElement => {
	const {
		control,
		formState: { isSubmitting },
		handleSubmit,
		reset,
	} = useForm<T>({
		defaultValues: initialData,
		mode: 'onBlur',
	});
	const [isProcessing, setProcessing] = useState<boolean>(false);
	const [preview, setPreview] = useState(false);
	const currentValues = useWatch({ control }) as T;

	useEffect(() => {
		if (localStorageInterval && localStorageInterval > 0) {
			const storedFormData = getItemFromStorage({ key: formName, type: 'json' });
			if (storedFormData) {
				reset(storedFormData as T);
			}
		}
	}, [formName, localStorageInterval]);

	useInterval(
		() => setItemInStorage({ key: formName, value: currentValues }),
		// stop local storage backup when form has been submitted
		isSubmitting ? -1 : localStorageInterval
	);

	const hasPreview = !!PreviewComponent;
	const togglePreview = () => setPreview(!preview);

	const submitForm = (update: T) => {
		if (localStorageInterval && localStorageInterval > 0) {
			removeItemsFromStorage([formName]);
		}
		setProcessing(true);
		submitFn(update).then(() => {
			setProcessing(false);
			reset();
		});
	};

	const generateFormField = (fieldSettings: FieldSetting<T>) => {
		return fieldSettings.type === 'buttonGroup'
			? generateButtonGroup(fieldSettings)
			: generateTextField(fieldSettings);
	};

	const generateTextField = ({ name, placeholder, isDisabled, rows, rules }: FieldSetting<T>) => (
		<Paper key={name}>
			<Controller
				control={control}
				name={name}
				rules={rules}
				render={({ field, formState: { errors } }) => (
					<TextField
						{...field}
						fullWidth
						id={`${formName}-${field.name}`}
						label={capitalize(field.name)}
						placeholder={placeholder}
						disabled={isDisabled}
						error={!!errors[field.name]}
						helperText={(errors[field.name]?.message as string) || ' '}
						multiline={!!rows}
						minRows={rows}
					/>
				)}
			/>
		</Paper>
	);

	const generateButtonGroup = ({ name, options }: FieldSetting<T>) => (
		<Controller
			key={name}
			control={control}
			name={name}
			render={({ field }) => (
				<FormControl margin='none'>
					<FormLabel id={`${formName}-${name}-label`}>
						<Typography fontWeight='bold'>{capitalize(name)}</Typography>
					</FormLabel>
					<ToggleButtonGroup
						{...field}
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
			)}
		/>
	);

	return (
		<>
			{hasPreview && PreviewComponent && (
				<>
					<Dialog open={preview} onClose={togglePreview} fullWidth maxWidth='lg'>
						<DialogTitle>{`Preview ${kebabCaseToTitleCase(formName)}`}</DialogTitle>
						<DialogContent>
							<PreviewComponent {...currentValues} />
						</DialogContent>
					</Dialog>
					<Stack direction='row-reverse'>
						<Button color='info' onClick={() => setPreview(true)}>
							<strong>Preview</strong>
						</Button>
					</Stack>
				</>
			)}
			<form onSubmit={handleSubmit(submitForm)}>
				<Stack spacing={4}>
					{fieldList.map(generateFormField)}
					<Box>
						<Button
							variant='contained'
							color='primary'
							size='large'
							type='submit'
							name={`submit-${formName}`}
							id={`submit-${formName}`}
							disabled={isProcessing}
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
