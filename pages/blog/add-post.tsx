import Head from 'next/head';

import AddEditBlogPost from '@/client/components/blog/add-edit-post';

const AddPost: React.FC = () => (
	<>
		<Head>
			<title key='title'>Add Blog Post - Media Bubbles</title>
		</Head>
		<AddEditBlogPost />
	</>
);

export default AddPost;
