import type { FeedbackMessage } from '@/types';
import { EMAIL_PATTERN, getRequiredMessage } from '@/util/form-utils';
import type { FieldSetting } from '@/components/shared/saveable-form';

export const REASON_OPTIONS = [
	{ value: 'Feedback', label: 'Give Feedback' },
	{ value: 'Question', label: 'Ask a Question' },
	{ value: 'Issue', label: 'Report an Issue' },
];

const FIELD_LIST: FieldSetting<FeedbackMessage>[] = [
	{
		name: 'reason',
		type: 'buttonGroup',
		options: REASON_OPTIONS,
	},
	{
		name: 'name',
		type: 'text',
		placeholder: 'John Doe',
		rules: { required: getRequiredMessage('name') },
	},
	{
		name: 'email',
		type: 'text',
		placeholder: 'johndoe@domain.com',
		rules: {
			required: getRequiredMessage('email'),
			pattern: { value: EMAIL_PATTERN, message: 'Invalid email format.' },
		},
	},
	{
		name: 'message',
		type: 'text',
		placeholder: 'This site is amazing!',
		rows: 8,
		rules: { required: getRequiredMessage('message') },
	},
];

export default FIELD_LIST;
