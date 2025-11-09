'use client';
import { useContext } from 'react';
import FIELD_LIST, { REASON_OPTIONS } from './field-list';
import type { FeedbackMessage, FeedbackSentResponse, ShowAlertFn } from '@/types';
import { useSession } from '@/lib/auth-client';
import SaveableForm from '@/components/shared/saveable-form';
import ALERT_LEVEL from '@/constants/alert-level';
import { AlertsDispatch } from '@/contexts/alerts-context';
import { callApi } from '@/services/api-service';

const blankFeedbackForm: FeedbackMessage = {
	name: '',
	email: '',
	reason: REASON_OPTIONS[0].value,
	message: '',
};

const submitFeedback = async (feedbackData: FeedbackMessage, showAlert: ShowAlertFn) => {
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
};

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
			fieldList={FIELD_LIST}
			formName='feedback'
			initialData={initialData}
			submitFn={feedbackData => submitFeedback(feedbackData, showAlert)}
			submitLabel='Send Message'
		/>
	);
};

export default Feedback;
