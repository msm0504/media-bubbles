import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { BlogPost } from '@/types';
import { getAllPostSlugs, getPost } from '@/services/blog-service';
import BlogPostTemplate from '@/components/blog/blog-post-template';

type PageParams = Promise<{
	slug: string;
}>;

export const generateMetadata = async ({ params }: { params: PageParams }): Promise<Metadata> => {
	const post = await getPost((await params).slug);
	if (!post || !Object.keys(post).length) {
		return notFound();
	}
	const title = `Blog - ${post.title} - Media Bubbles`;
	const description = post.excerpt?.replace(/[*_#>]/g, '');
	return {
		title,
		description,
		alternates: {
			canonical: `${process.env.NEXT_PUBLIC_URL}/blog/${post.slug}`,
		},
		openGraph: {
			title,
			description,
			url: `${process.env.NEXT_PUBLIC_URL}/blog/${post.slug}`,
			type: 'article',
			publishedTime: post.updatedAt,
			tags: post.slug.split('-').slice(3),
		},
	};
};

export const generateStaticParams = async () => {
	const slugs = await getAllPostSlugs();
	return slugs.map(({ slug }) => ({ slug }));
};

const getBlogPost = async (params: PageParams): Promise<BlogPost> => {
	const post = await getPost((await params).slug);
	if (!post || !Object.keys(post).length) {
		return notFound();
	}
	return post;
};

const BlogPostPage = async ({ params }: { params: PageParams }) => {
	const post = await getBlogPost(params);
	return (
		<BlogPostTemplate content={post.content} date={post.updatedAt as string} title={post.title} />
	);
};

export default BlogPostPage;
