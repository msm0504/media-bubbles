import { connect } from 'react-redux';

import SaveableForm, { getRequiredMessage } from '../client/components/saveable-form';
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
	const initialData = {
		...blankFeedbackForm,
		name: defaultName,
		email: defaultEmail
	};

	const fieldList = [
		{
			name: 'name',
			type: 'text',
			placeholder: 'John Doe'
		},
		{
			name: 'email',
			type: 'text',
			placeholder: 'johndoe@domain.com'
		},
		{
			name: 'reason',
			type: 'buttonGroup',
			options: REASON_OPTIONS
		},
		{
			name: 'message',
			type: 'textarea',
			placeholder: 'This site is amazing!',
			rows: 8
		}
	];

	return (
		<>
			<h1 className='text-info'>Contact Us</h1>
			<SaveableForm
				fieldList={fieldList}
				fieldValidateFn={getFieldErrorMessage}
				formName='feedback'
				initialData={initialData}
				submitFn={submitForm}
				submitLabel='Send Message'
			/>
		</>
	);
};

export default connect(mapStateToProps, mapDispatchToProps)(Feedback);
