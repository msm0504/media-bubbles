'use client';
import { useEffect, useContext } from 'react';
import { Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import BlogPostTemplate from './blog-post-template';
import FIELD_LIST from './field-list';
import SaveableForm from '../shared/saveable-form';
import ALERT_LEVEL from '@/constants/alert-level';
import { isAdmin } from '@/constants/admin-role';
import { AlertsDispatch } from '@/contexts/alerts-context';
import { useSession } from '@/lib/auth-client';
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

const MILLISECONDS_IN_MINUTE = 1000 * 60;

const submitPost = async (blogPostData: BlogPost, showAlert: ShowAlertFn) => {
	const isUpdate = !!blogPostData._id;
	const { itemId: slug } = await callApi<ItemSavedResponse, BlogPost>(
		isUpdate ? 'put' : 'post',
		`blog-posts${isUpdate ? `/${blogPostData._id}` : ''}`,
		blogPostData
	);
	if (!slug) {
		showAlert(ALERT_LEVEL.warning, 'Saving blog post failed. Please try again later.');
	} else {
		showAlert(ALERT_LEVEL.success, `Blog post ${slug} saved successfully.`);
	}
};

const BlogPostPreview = ({ content, title }: BlogPost) => {
	const currentDate = new Date().toISOString();
	return <BlogPostTemplate content={content} date={currentDate} title={title} />;
};

const AddEditBlogPost: React.FC<AddEditPostProps> = ({ currentVersion }) => {
	const showAlert = useContext(AlertsDispatch);
	const { data: session } = useSession();
	const router = useRouter();

	useEffect(() => {
		const slugField = FIELD_LIST.find(field => field.name === 'slug');
		if (slugField) {
			slugField.isDisabled = !!currentVersion;
		}
	}, [currentVersion]);

	if (!isAdmin(session?.user.role)) {
		return <Typography color='info'>You shall not post!</Typography>;
	}

	const mode = currentVersion ? 'Edit' : 'Add';
	const initialData = currentVersion || { ...blankBlogPostForm, author: session.user.name };

	const submitFn = async (blogPostData: BlogPost) => {
		await submitPost(blogPostData, showAlert);
		router.push('/blog');
	};

	return (
		<>
			<PageHeading heading={`${mode} Post`} />
			<SaveableForm<BlogPost>
				fieldList={FIELD_LIST}
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
