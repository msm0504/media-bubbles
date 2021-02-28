import Head from 'next/head';
import { useRouter } from 'next/router';

import Spinner from '../../client/components/spinner';
import BlogPostTemplate from '../../client/components/blog/blog-post-template';
import { getAllPostSlugs, getPost } from '../../server/services/blog-service';

const BlogPost = ({ post }) => {
	const router = useRouter();

	return router.isFallback ? (
		<Spinner />
	) : (
		<>
			<Head>
				<meta
					property='og:url'
					content={`${process.env.NEXT_PUBLIC_API_URL}${router.asPath}`}
					key='ogUrl'
				></meta>
				<meta property='og:title' content={post.title}></meta>
				<meta property='og:description' content={post.excerpt}></meta>
				<meta property='og:type' content='article'></meta>
				<meta property='article:published_time' content={post.date}></meta>
				<meta property='article:tag' content={post.slug.split('_').slice(3).join(' ')}></meta>
			</Head>
			<BlogPostTemplate content={post.content} date={post.date} title={post.title} />
		</>
	);
};

export default BlogPost;

export async function getStaticProps({ params: { slug } }) {
	const post = await getPost(slug);
	return {
		props: {
			post
		},
		revalidate: 60
	};
}

export async function getStaticPaths() {
	const slugs = await getAllPostSlugs();

	return {
		paths: slugs.map(slug => ({ params: { slug } })),
		fallback: true
	};
}
