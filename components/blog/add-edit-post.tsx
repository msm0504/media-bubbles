'use client';
import { useEffect, useContext } from 'react';
import { Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import BlogPostTemplate from './blog-post-template';
import SaveableForm, { getRequiredMessage, FieldSetting } from '../shared/saveable-form';
import ALERT_LEVEL from '@/constants/alert-level';
import { AlertsDispatch } from '@/contexts/alerts-context';
import { callApi } from '@/services/api-service';
import type { BlogPost, ItemSavedResponse, ShowAlertFn } from '@/types';
import PageHeading from '../shared/page-heading';

type AddEditPostProps = {
	currentVersion?: BlogPost;
};

const blankBlogPostForm = {
	author: '',
	slug: '',
	title: '',
	content: '',
};

const SLUG_PATTERN = /^[a-z0-9-]+$/;
const MILLISECONDS_IN_MINUTE = 1000 * 60;

export const fieldList: FieldSetting[] = [
	{
		name: 'author',
		type: 'text',
		placeholder: 'Some Guy',
		isDisabled: true,
	},
	{
		name: 'slug',
		type: 'text',
		placeholder: 'important-key-words',
	},
	{
		name: 'title',
		type: 'text',
		placeholder: 'Everyone Will Want to Read This!',
	},
	{
		name: 'content',
		type: 'text',
		placeholder: 'Very profound observations...blah...blah...blah...',
		rows: 15,
	},
];

const getFieldErrorMessage = (fieldName: string, value: string | undefined) => {
	switch (fieldName) {
		case 'author':
			if (!value) return 'You must be logged in to submit a post';
			break;
		case 'slug':
			if (!value) return getRequiredMessage(fieldName);
			if (!SLUG_PATTERN.test(value))
				return 'Slug can only contain lowercase letters, numbers, and dashes.';
			break;
		case 'title':
			if (!value) return getRequiredMessage(fieldName);
			break;
		case 'content':
			if (!value) return getRequiredMessage(fieldName);
			break;
		default:
			return '';
	}

	return '';
};

async function submitPost(blogPostData: BlogPost, showAlert: ShowAlertFn) {
	const { itemId: slug } = await callApi<ItemSavedResponse, BlogPost>(
		'post',
		'blog-posts',
		blogPostData
	);
	if (!slug) {
		showAlert(ALERT_LEVEL.warning, 'Saving blog post failed. Please try again later.');
	} else {
		showAlert(ALERT_LEVEL.success, `Blog post ${slug} saved successfully.`);
	}
}

const BlogPostPreview = ({ content, title }: BlogPost) => {
	const currentDate = new Date().toISOString();
	return <BlogPostTemplate content={content} date={currentDate} title={title} />;
};

const AddEditBlogPost: React.FC<AddEditPostProps> = ({ currentVersion }) => {
	const showAlert = useContext(AlertsDispatch);
	const { data: session } = useSession();
	const router = useRouter();

	useEffect(() => {
		const slugField = fieldList.find(field => field.name === 'slug');
		if (slugField) {
			slugField.isDisabled = !!currentVersion;
		}
	}, [currentVersion]);

	if (!session?.user.isAdmin) {
		return <Typography color='info'>You shall not post!</Typography>;
	}

	const mode = currentVersion ? 'Edit' : 'Add';
	const initialData = currentVersion || { ...blankBlogPostForm, author: session.user.name };

	async function submitFn(blogPostData: BlogPost) {
		await submitPost(blogPostData, showAlert);
		router.push('/blog');
	}

	return (
		<>
			<PageHeading heading={`${mode} Post`} />
			<SaveableForm<BlogPost>
				fieldList={fieldList}
				fieldValidateFn={getFieldErrorMessage}
				formName='blog-post'
				initialData={initialData}
				localStorageInterval={currentVersion ? -1 : MILLISECONDS_IN_MINUTE}
				PreviewComponent={BlogPostPreview}
				submitFn={submitFn}
				submitLabel='Save Post'
			/>
		</>
	);
};

export default AddEditBlogPost;
