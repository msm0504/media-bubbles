import Head from 'next/head';

import AddEditBlogPost from '../../../client/components/blog/add-edit-post';
import { getPost } from '../../../server/services/blog-service';

const EditPost = ({ post }) => (
	<>
		<Head>
			<title key='title'>{`Edit Blog Post ${post.slug} - Media Bubbles`}</title>
		</Head>
		<AddEditBlogPost currentVersion={post} />
	</>
);

export default EditPost;

export async function getServerSideProps({ params: { slug } }) {
	const post = (await getPost(slug)) || {};
	return {
		props: {
			post
		}
	};
}
