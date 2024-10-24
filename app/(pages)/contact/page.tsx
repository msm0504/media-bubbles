'use client';
import { useContext } from 'react';
import { useSession } from 'next-auth/react';
import type { FeedbackMessage, FeedbackSentResponse, ShowAlertFn } from '@/types';
import SaveableForm, { FieldSetting, getRequiredMessage } from '@/components/shared/saveable-form';
import ALERT_LEVEL from '@/constants/alert-level';
import { AlertsDispatch } from '@/contexts/alerts-context';
import { callApi } from '@/services/api-service';

const REASON_OPTIONS = [
	{ value: 'Feedback', label: 'Give Feedback' },
	{ value: 'Question', label: 'Ask a Question' },
	{ value: 'Issue', label: 'Report an Issue' },
];

const blankFeedbackForm = {
	name: '',
	email: '',
	reason: REASON_OPTIONS[0].value,
	message: '',
};

const EMAIL_PATTERN = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

const fieldList: FieldSetting[] = [
	{
		name: 'reason',
		type: 'buttonGroup',
		options: REASON_OPTIONS,
	},
	{
		name: 'name',
		type: 'text',
		placeholder: 'John Doe',
	},
	{
		name: 'email',
		type: 'text',
		placeholder: 'johndoe@domain.com',
	},
	{
		name: 'message',
		type: 'text',
		placeholder: 'This site is amazing!',
		rows: 8,
	},
];

const getFieldErrorMessage = (fieldName: string, value: string | undefined) => {
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

async function submitFeedback(feedbackData: FeedbackMessage, showAlert: ShowAlertFn) {
	const { feedbackSent } = await callApi<FeedbackSentResponse, FeedbackMessage>(
		'post',
		'feedback',
		feedbackData
	);
	if (feedbackSent !== true) {
		showAlert(ALERT_LEVEL.warning, 'Sending this message failed. Please try again later.');
	} else {
		showAlert(ALERT_LEVEL.success, 'Message sent successfully.');
	}
}

const Feedback: React.FC = () => {
	const showAlert = useContext(AlertsDispatch);
	const { data: session } = useSession();

	const initialData = {
		...blankFeedbackForm,
		name: session?.user.name || '',
		email: session?.user.email || '',
	};

	return (
		<SaveableForm<FeedbackMessage>
			fieldList={fieldList}
			fieldValidateFn={getFieldErrorMessage}
			formName='feedback'
			initialData={initialData}
			submitFn={feedbackData => submitFeedback(feedbackData, showAlert)}
			submitLabel='Send Message'
		/>
	);
};

export default Feedback;
