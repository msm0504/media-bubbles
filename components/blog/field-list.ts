import type { BlogPost } from '@/types';
import { getRequiredMessage } from '@/util/form-utils';
import type { FieldSetting } from '@/components/shared/saveable-form';

const SLUG_PATTERN = /^[a-z0-9-]+$/;

const FIELD_LIST: FieldSetting<BlogPost>[] = [
	{
		name: 'author',
		type: 'text',
		placeholder: 'Some Guy',
		isDisabled: true,
		rules: { required: 'You must be logged in to submit a post' },
	},
	{
		name: 'slug',
		type: 'text',
		placeholder: 'important-key-words',
		rules: {
			required: getRequiredMessage('slug'),
			pattern: {
				value: SLUG_PATTERN,
				message: 'Slug can only contain lowercase letters, numbers, and dashes.',
			},
		},
	},
	{
		name: 'title',
		type: 'text',
		placeholder: 'Everyone Will Want to Read This!',
		rules: { required: getRequiredMessage('title') },
	},
	{
		name: 'content',
		type: 'text',
		placeholder: 'Very profound observations...blah...blah...blah...',
		rows: 15,
		rules: { required: getRequiredMessage('content') },
	},
];

export default FIELD_LIST;
