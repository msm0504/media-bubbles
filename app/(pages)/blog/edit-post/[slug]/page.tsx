import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPost } from '@/services/blog-service';
import AddEditBlogPost from '@/components/blog/add-edit-post';

type PageParams = {
	slug: string;
};

export const generateMetadata = ({ params }: { params: PageParams }): Metadata => ({
	title: `Edit Blog Post ${params.slug} - Media Bubbles`,
});

const EditPost = async ({ params }: { params: PageParams }) => {
	const post = await getPost(params.slug);
	if (!post || !Object.keys(post).length) {
		return notFound();
	}
	return <AddEditBlogPost currentVersion={post} />;
};

export default EditPost;
