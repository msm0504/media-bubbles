import { GetStaticProps } from 'next';
import Head from 'next/head';

import AddEditBlogPost from '@/client/components/blog/add-edit-post';
import { getPost } from '@/server/services/blog-service';
import type { BlogPost } from '@/types';

type RouteParam = { params: { slug: string } };
type EditPostProps = {
	post: BlogPost;
};

const EditPost: React.FC<EditPostProps> = ({ post }) => (
	<>
		<Head>
			<title key='title'>{`Edit Blog Post ${post.slug} - Media Bubbles`}</title>
		</Head>
		<AddEditBlogPost currentVersion={post} />
	</>
);

export default EditPost;

export const getServerSideProps: GetStaticProps = async ({ params: { slug } }: RouteParam) => {
	const post = (await getPost(slug)) || {};
	return {
		props: {
			post
		}
	};
};
