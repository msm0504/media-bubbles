import type { FieldSetting } from '@/components/shared/saveable-form';

export const REASON_OPTIONS = [
	{ value: 'Feedback', label: 'Give Feedback' },
	{ value: 'Question', label: 'Ask a Question' },
	{ value: 'Issue', label: 'Report an Issue' },
];

const FIELD_LIST: FieldSetting[] = [
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

export default FIELD_LIST;
