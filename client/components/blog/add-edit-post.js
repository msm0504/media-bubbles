import { connect } from 'react-redux';
import { CardBody } from 'reactstrap';

import SaveableForm, { getRequiredMessage } from '../saveable-form';
import UIActions from '../../actions/ui-actions';

const blankBlogPostForm = {
	author: '',
	slug: '',
	title: '',
	content: ''
};

const SLUG_PATTERN = /^[a-z0-9_]+$/;

const getFieldErrorMessage = (fieldName, value) => {
	switch (fieldName) {
		case 'author':
			if (!value) return 'You must be logged in to submit a post';
			break;
		case 'slug':
			if (!value) return getRequiredMessage(fieldName);
			if (!SLUG_PATTERN.test(value))
				return 'Slug can only contain lowercase letters, numbers, and underscores.';
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

const mapStateToProps = ({ loginState: { fbUserInfo } }) => ({
	authorId: fbUserInfo.userId,
	author: fbUserInfo.name
});

const mapDispatchToProps = {
	submitForm: UIActions.submitBlogPost
};

const AddEditBlogPost = ({ author, authorId, currentVersion, submitForm }) => {
	if (authorId !== process.env.NEXT_PUBLIC_ADMIN_ID)
		return <CardBody className='text-info'>You shall not post!</CardBody>;

	const mode = currentVersion ? 'Edit' : 'Add';
	const initialData = currentVersion || { ...blankBlogPostForm, author };
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
			placeholder: 'important_key_words',
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

	return (
		<>
			<h1 className='text-info'>{`${mode} Post`}</h1>
			<SaveableForm
				fieldList={fieldList}
				fieldValidateFn={getFieldErrorMessage}
				formName='feedback'
				initialData={initialData}
				submitFn={submitForm}
				submitLabel='Save Post'
			/>
		</>
	);
};

export default connect(mapStateToProps, mapDispatchToProps)(AddEditBlogPost);
