'use client';
import { useState, useEffect, ReactElement } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import type { DefaultValues, FieldValues, Path, RegisterOptions } from 'react-hook-form';
import { Dialog, Field, Toggle, ToggleGroup } from '@base-ui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faSpinner } from '@fortawesome/free-solid-svg-icons';
import capitalize from 'lodash.capitalize';
import { Button, Input, Paper } from './base-ui';
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

type SaveableFormProps<T extends FieldValues> = {
	fieldList: FieldSetting<T>[];
	formName: string;
	initialData: DefaultValues<T>;
	localStorageInterval?: number;
	PreviewComponent?: React.FC<T>;
	submitFn: (formData: T) => Promise<void>;
	submitLabel: string;
};

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
	}, [formName, localStorageInterval, reset]);

	useInterval(
		() => setItemInStorage({ key: formName, value: currentValues }),
		// stop local storage backup when form has been submitted
		isSubmitting ? -1 : localStorageInterval
	);

	const hasPreview = !!PreviewComponent;

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
		<Controller
			key={name}
			control={control}
			name={name}
			rules={rules}
			render={({ field, fieldState: { invalid, isTouched, isDirty, error } }) => {
				return (
					<Field.Root
						className='flex w-full flex-col items-start gap-1'
						invalid={invalid}
						touched={isTouched}
						dirty={isDirty}
					>
						<Field.Label htmlFor={`${formName}-${field.name}`} className='capitalize'>
							{field.name}
						</Field.Label>
						<Input
							{...field}
							id={`${formName}-${field.name}`}
							placeholder={placeholder}
							disabled={isDisabled}
							render={rows ? props => <textarea {...props} rows={rows} /> : undefined}
						/>
						<Field.Error className='text-sm text-error' match={!!error}>
							{error?.message}
						</Field.Error>
					</Field.Root>
				);
			}}
		/>
	);

	const generateButtonGroup = ({ name, options }: FieldSetting<T>) => (
		<Controller
			key={name}
			control={control}
			name={name}
			render={({ field }) => (
				<Field.Root className='flex flex-col items-start gap-1'>
					<Field.Label id={`${formName}-${name}-label`} className='capitalize'>
						{name}
					</Field.Label>
					<ToggleGroup
						value={field.value ? [field.value as string] : []}
						onValueChange={values => field.onChange(values[0] ?? null)}
						aria-labelledby={`${formName}-${name}-label`}
						className='flex gap-2'
					>
						{options?.map(({ value, label }) => (
							<Toggle
								key={value}
								value={value}
								className='rounded-xl border border-neutral-950 px-4 py-2 text-neutral-950 data-pressed:border-primary data-pressed:font-semibold data-pressed:text-primary'
							>
								{label}
							</Toggle>
						))}
					</ToggleGroup>
				</Field.Root>
			)}
		/>
	);

	return (
		<>
			{hasPreview && PreviewComponent && (
				<div className='flex flex-row-reverse'>
					<Dialog.Root open={preview} onOpenChange={setPreview}>
						<Dialog.Trigger
							render={props => (
								<Button {...props} color='info' variant='text'>
									Preview
								</Button>
							)}
						/>
						<Dialog.Portal>
							<Dialog.Backdrop className='fixed inset-0 min-h-dvh bg-black/20 data-ending-style:opacity-0 data-starting-style:opacity-0' />
							<Dialog.Popup className='fixed top-1/2 left-1/2 flex w-full max-w-6xl -translate-x-1/2 -translate-y-1/2 flex-col gap-4 rounded-xl bg-white p-4 text-neutral-950 shadow-lg outline-none data-ending-style:scale-98 data-ending-style:opacity-0 data-starting-style:scale-98 data-starting-style:opacity-0'>
								<Dialog.Title className='text-xl font-bold'>
									{`Preview ${kebabCaseToTitleCase(formName)}`}
								</Dialog.Title>
								<PreviewComponent {...currentValues} />
							</Dialog.Popup>
						</Dialog.Portal>
					</Dialog.Root>
				</div>
			)}
			<form onSubmit={handleSubmit(submitForm)}>
				<Paper className='flex flex-col gap-6'>
					{fieldList.map(generateFormField)}
					<div>
						<Button
							className='text-lg'
							variant='contained'
							color='primary'
							type='submit'
							name={`submit-${formName}`}
							id={`submit-${formName}`}
							disabled={isProcessing}
						>
							{submitLabel}
							<FontAwesomeIcon
								icon={isProcessing ? faSpinner : faPaperPlane}
								spinPulse={isProcessing}
							/>
						</Button>
						<Button>Test</Button>
					</div>
				</Paper>
			</form>
		</>
	);
};

export default SaveableForm;
