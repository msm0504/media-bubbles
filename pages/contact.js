import { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Button, Form, FormFeedback, FormGroup, Input, Label } from 'reactstrap';

import BackButton from '../client/components/nav/back-button';
import UIActions from '../client/actions/ui-actions';

const REASON_OPTIONS = [
	{ value: 'Feedback', label: 'Give Feedback' },
	{ value: 'Question', label: 'Ask a Question' },
	{ value: 'Issue', label: 'Report an Issue' }
];

const blankFeedbackForm = {
	name: '',
	email: '',
	reason: REASON_OPTIONS[0].value,
	message: ''
};

const EMAIL_PATTERN = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

const getRequiredMessage = fieldName =>
	`${fieldName.charAt(0).toUpperCase()}${fieldName.substring(1)} is required`;

const getFieldErrorMessage = (fieldName, value) => {
	switch (fieldName) {
		case 'name':
			if (!value) return getRequiredMessage(fieldName);
			break;
		case 'email':
			if (!value) return getRequiredMessage(fieldName);
			if (!EMAIL_PATTERN.test(value)) return 'Invalid email format.';
			break;
		case 'message':
			if (!value) return getRequiredMessage(fieldName);
			break;
		default:
			return '';
	}

	return '';
};

const mapStateToProps = ({ loginState: { fbUserInfo } }) => ({
	defaultName: fbUserInfo.name,
	defaultEmail: fbUserInfo.email
});

const mapDispatchToProps = {
	submitForm: UIActions.submitFeedback
};

const Feedback = ({ defaultEmail, defaultName, submitForm }) => {
	const [feedbackData, setFeedbackData] = useState({
		...blankFeedbackForm,
		name: defaultName,
		email: defaultEmail
	});
	const [errors, setErrors] = useState({});
	const [submit, setSubmit] = useState(false);

	useEffect(() => {
		if (submit && !Object.keys(errors).length) {
			submitForm(feedbackData);
		}
		setSubmit(false);
	}, [errors]);

	const fieldChanged = event => {
		setFeedbackData({
			...feedbackData,
			[event.target.name]: event.target.value
		});
	};

	const updateFieldError = event => {
		const {
			target: { name: fieldName, value }
		} = event;
		const error = getFieldErrorMessage(fieldName, value);

		if (error && errors[fieldName] !== error) {
			setErrors({ ...errors, [fieldName]: error });
		} else if (!error && errors[fieldName]) {
			const { [fieldName]: oldError, ...remainingErrors } = errors;
			setErrors(remainingErrors);
		}
	};

	const updateFormErrors = () => {
		setErrors(
			Object.keys(feedbackData).reduce((acc, fieldName) => {
				const error = getFieldErrorMessage(fieldName, feedbackData[fieldName]);
				if (error) acc[fieldName] = error;
				return acc;
			}, {})
		);
	};

	const submitClicked = () => {
		setSubmit(true);
		updateFormErrors();
	};

	return (
		<>
			<BackButton className='mb-3' />
			<Form>
				<FormGroup>
					<Label for='feedback-name'>
						<strong>Name</strong>
					</Label>
					<Input
						type='text'
						name='name'
						id='feedback-name'
						placeholder='John Doe'
						invalid={!!errors.name}
						value={feedbackData.name}
						onChange={fieldChanged}
						onBlur={updateFieldError}
					/>
					<FormFeedback>{errors.name}</FormFeedback>
				</FormGroup>
				<FormGroup>
					<Label for='feedback-email'>
						<strong>Email</strong>
					</Label>
					<Input
						type='text'
						name='email'
						id='feedback-email'
						placeholder='johndoe@domain.com'
						invalid={!!errors.email}
						value={feedbackData.email}
						onChange={fieldChanged}
						onBlur={updateFieldError}
					/>
					<FormFeedback>{errors.email}</FormFeedback>
				</FormGroup>
				<FormGroup tag='fieldset'>
					<legend className='col-form-label'>
						<strong>Reason</strong>
					</legend>
					<div className='btn-group btn-group-toggle'>
						{REASON_OPTIONS.map(({ value, label }) => (
							<Label
								key={value}
								className={`btn btn-outline-info ${value === feedbackData.reason ? 'active' : ''}`}
							>
								<Input
									type='radio'
									name='reason'
									id={`feedback-reason-${value}`}
									value={value}
									checked={value === feedbackData.reason}
									onChange={fieldChanged}
								/>
								{label}
							</Label>
						))}
					</div>
				</FormGroup>
				<FormGroup>
					<Label for='feedback-message'>
						<strong>Message</strong>
					</Label>
					<Input
						type='textarea'
						rows={8}
						name='message'
						id='feedback-message'
						placeholder='This site is amazing!'
						invalid={!!errors.message}
						value={feedbackData.message}
						onChange={fieldChanged}
						onBlur={updateFieldError}
					/>
					<FormFeedback>{errors.message}</FormFeedback>
				</FormGroup>
				<Button
					color='primary'
					size='lg'
					name='submitFeedback'
					id='submitFeedback'
					onClick={submitClicked}
				>
					<strong>Send Message</strong>
				</Button>
			</Form>
		</>
	);
};

export default connect(mapStateToProps, mapDispatchToProps)(Feedback);
