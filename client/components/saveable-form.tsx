import { useState, useEffect, ChangeEvent, FocusEvent, Fragment, ReactElement } from 'react';
import { Button, Col, Form, Modal, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';

import useInterval from '../hooks/use-interval';
import {
	getItemFromStorage,
	setItemInStorage,
	removeItemsFromStorage
} from '../util/local-storage-util';

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
	localStorageInterval,
	PreviewComponent,
	submitFn,
	submitLabel
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

	const fieldChanged = (event: ChangeEvent<HTMLInputElement>) => {
		setFormData({
			...formData,
			[event.target.name]: event.target.value
		});
	};

	const updateFieldError = (event: FocusEvent<HTMLInputElement>) => {
		const {
			target: { name: fieldName, value }
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
		<Form.Group className='mb-3' key={name}>
			<Form.Label htmlFor={`${formName}-${name}`}>
				<strong>{capitalize(name)}</strong>
			</Form.Label>
			<Form.Control
				as={rows ? 'textarea' : 'input'}
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				rows={rows || null}
				name={name}
				id={`${formName}-${name}`}
				placeholder={placeholder}
				disabled={isDisabled}
				isInvalid={!!errors[name]}
				value={formData[name as keyof T]}
				onChange={fieldChanged}
				onBlur={updateFieldError}
			/>
			<Form.Control.Feedback type='invalid'>{errors[name]}</Form.Control.Feedback>
		</Form.Group>
	);

	const generateButtonGroup = ({ name, options }: FieldSetting) => (
		<Form.Group className='mb-3' as='fieldset' key={name}>
			<legend className='col-form-label'>
				<strong>{capitalize(name)}</strong>
			</legend>
			<div className='btn-group' role='group'>
				{options?.map(({ value, label }) => {
					const id = `${formName}-${name}-${value}`;
					return (
						<Fragment key={value}>
							<Form.Check.Input
								className='btn-check'
								type='radio'
								name={name}
								id={id}
								value={value}
								checked={value === formData[name as keyof T]}
								onChange={fieldChanged}
								autoComplete='off'
							/>
							<Form.Check.Label className='btn btn-outline-info' htmlFor={id}>
								{label}
							</Form.Check.Label>
						</Fragment>
					);
				})}
			</div>
		</Form.Group>
	);

	return (
		<>
			{hasPreview && PreviewComponent && (
				<>
					<Modal show={preview} onHide={togglePreview} size='lg'>
						<Modal.Header closeButton>{`Preview ${kebabCaseToTitleCase(formName)}`}</Modal.Header>
						<Modal.Body>
							<PreviewComponent {...formData} />
						</Modal.Body>
					</Modal>
					<Row className='m-0'>
						<Col xs={12} className='m-0'>
							<Button
								className='float-end d-inline-block'
								variant='outline-info'
								onClick={() => setPreview(true)}
							>
								<strong>Preview</strong>
							</Button>
						</Col>
					</Row>
				</>
			)}
			<Form>
				{fieldList.map(generateFormField)}
				<Button
					variant='primary'
					size='lg'
					name={`submit-${formName}`}
					id={`submit-${formName}`}
					disabled={isProcessing}
					onClick={submitClicked}
				>
					<strong>{submitLabel}</strong>
					{isProcessing && <FontAwesomeIcon className='ms-2' icon={solid('spinner')} pulse />}
				</Button>
			</Form>
		</>
	);
};

export default SaveableForm;
