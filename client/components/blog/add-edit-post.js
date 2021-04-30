import { useDispatch } from 'react-redux';
import { CardBody } from 'reactstrap';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/client';

import BlogPostTemplate from './blog-post-template';
import SaveableForm, { getRequiredMessage } from '../saveable-form';
import UIActions from '../../actions/ui-actions';

const blankBlogPostForm = {
	author: '',
	slug: '',
	title: '',
	content: ''
};

const SLUG_PATTERN = /^[a-z0-9-]+$/;
const MILLISECONDS_IN_MINUTE = 1000 * 60;

const getFieldErrorMessage = (fieldName, value) => {
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

const BlogPostPreview = ({ content, title }) => {
	const currentDate = new Date().toISOString();
	return <BlogPostTemplate content={content} date={currentDate} title={title} />;
};

const AddEditBlogPost = ({ currentVersion }) => {
	const dispatch = useDispatch();
	const [session] = useSession();

	if (!session?.user.isAdmin) return <CardBody className='text-info'>You shall not post!</CardBody>;

	const router = useRouter();
	const mode = currentVersion ? 'Edit' : 'Add';
	const initialData = currentVersion || { ...blankBlogPostForm, author: session.user.name };
	const fieldList = [
		{
			name: 'author',
			type: 'text',
			placeholder: 'Some Guy',
			isDisabled: true
		},
		{
			name: 'slug',
			type: 'text',
			placeholder: 'important-key-words',
			isDisabled: !!currentVersion
		},
		{
			name: 'title',
			type: 'text',
			placeholder: 'Everyone Will Want to Read This!'
		},
		{
			name: 'content',
			type: 'textarea',
			placeholder: 'Very profound observations...blah...blah...blah...',
			rows: 15
		}
	];

	const submitFn = blogPostData => {
		dispatch(UIActions.submitBlogPost(blogPostData));
		router.push('/blog');
	};

	return (
		<>
			<h1 className='text-info'>{`${mode} Post`}</h1>
			<SaveableForm
				fieldList={fieldList}
				fieldValidateFn={getFieldErrorMessage}
				formName='blog-post'
				initialData={initialData}
				localStorageInterval={!currentVersion && MILLISECONDS_IN_MINUTE}
				PreviewComponent={BlogPostPreview}
				submitFn={submitFn}
				submitLabel='Save Post'
			/>
		</>
	);
};

export default AddEditBlogPost;
