import { useState, useEffect } from 'react';
import { Button, Col, Form, Modal, Row } from 'react-bootstrap';

import useInterval from '../hooks/use-interval';
import {
	getItemFromStorage,
	setItemInStorage,
	removeItemsFromStorage
} from '../util/local-storage-util';

const capitalize = str => `${str.charAt(0).toUpperCase()}${str.substring(1)}`;
const kebabCaseToTitleCase = str => str.split('-').map(capitalize).join(' ');

export const getRequiredMessage = fieldName => `${capitalize(fieldName)} is required`;

const SaveableForm = ({
	fieldList,
	fieldValidateFn,
	formName,
	initialData,
	localStorageInterval,
	PreviewComponent,
	submitFn,
	submitLabel
}) => {
	const [formData, setFormData] = useState(initialData);
	const [errors, setErrors] = useState({});
	const [submit, setSubmit] = useState(false);
	const [preview, setPreview] = useState(false);

	useEffect(() => {
		if (localStorageInterval && localStorageInterval > 0) {
			const storedFormData = getItemFromStorage({ key: formName, type: 'json' });
			if (storedFormData) {
				setFormData(storedFormData);
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
			submitFn(formData);
		}
		setSubmit(false);
	}, [errors]);

	const hasPreview = !!PreviewComponent;
	const togglePreview = () => setPreview(!preview);

	const fieldChanged = event => {
		setFormData({
			...formData,
			[event.target.name]: event.target.value
		});
	};

	const updateFieldError = event => {
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
			Object.keys(formData).reduce((acc, fieldName) => {
				const error = fieldValidateFn(fieldName, formData[fieldName]);
				if (error) acc[fieldName] = error;
				return acc;
			}, {})
		);
	};

	const submitClicked = () => {
		setSubmit(true);
		updateFormErrors();
	};

	const generateFormField = fieldSettings => {
		return fieldSettings.type === 'buttonGroup'
			? generateButtonGroup(fieldSettings)
			: generateTextField(fieldSettings);
	};

	const generateTextField = ({ name, placeholder, isDisabled, rows }) => (
		<Form.Group className='mb-3' key={name}>
			<Form.Label htmlFor={`${formName}-${name}`}>
				<strong>{capitalize(name)}</strong>
			</Form.Label>
			<Form.Control
				as={rows ? 'textarea' : 'input'}
				rows={rows || null}
				name={name}
				id={`${formName}-${name}`}
				placeholder={placeholder}
				disabled={isDisabled}
				isInvalid={!!errors[name]}
				value={formData[name]}
				onChange={fieldChanged}
				onBlur={updateFieldError}
			/>
			<Form.Control.Feedback type='invalid'>{errors[name]}</Form.Control.Feedback>
		</Form.Group>
	);

	const generateButtonGroup = ({ name, options }) => (
		<Form.Group className='mb-3' tag='fieldset' key={name}>
			<legend className='col-form-label'>
				<strong>{capitalize(name)}</strong>
			</legend>
			<div className='btn-group' role='group'>
				{options.map(({ value, label }) => (
					<Form.Check.Label
						key={value}
						className={`btn btn-outline-info ${value === formData[name] ? 'active' : ''}`}
					>
						<Form.Check.Input
							type='radio'
							name={name}
							id={`${formName}-${name}-${value}`}
							value={value}
							checked={value === formData[name]}
							onChange={fieldChanged}
						/>
						{label}
					</Form.Check.Label>
				))}
			</div>
		</Form.Group>
	);

	return (
		<>
			{hasPreview && (
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
					onClick={submitClicked}
				>
					<strong>{submitLabel}</strong>
				</Button>
			</Form>
		</>
	);
};

export default SaveableForm;
