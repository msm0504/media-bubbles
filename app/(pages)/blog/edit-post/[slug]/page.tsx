import { Suspense } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPost } from '@/services/blog-service';
import AddEditBlogPost from '@/components/blog/add-edit-post';
import Spinner from '@/components/shared/spinner';

type PageParams = Promise<{
	slug: string;
}>;

export const generateMetadata = async ({ params }: { params: PageParams }): Promise<Metadata> => ({
	title: `Edit Blog Post ${(await params).slug} - Media Bubbles`,
});

const EditPost = async ({ params }: { params: PageParams }) => {
	const post = await getPost((await params).slug);
	if (!post || !Object.keys(post).length) {
		return notFound();
	}
	return <AddEditBlogPost currentVersion={post} />;
};

const EditPostFallback = ({ params }: { params: PageParams }) => (
	<Suspense fallback={<Spinner />}>
		<EditPost params={params} />
	</Suspense>
);

export default EditPostFallback;
