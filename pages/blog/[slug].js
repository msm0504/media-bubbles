import Head from 'next/head';
import { useRouter } from 'next/router';
import { CardBody } from 'reactstrap';

import Spinner from '../../client/components/spinner';
import BlogPostTemplate from '../../client/components/blog/blog-post-template';
import { getAllPostSlugs, getPost } from '../../server/services/blog-service';

const BlogPost = ({ post, notFound }) => {
	const router = useRouter();

	return router.isFallback ? (
		<Spinner />
	) : notFound ? (
		<CardBody className='text-info'>{'No blog post found for this slug'}</CardBody>
	) : (
		<>
			<Head>
				<title key='title'>{`Blog - ${post.title} - Media Bubbles`}</title>
				<meta
					property='og:url'
					content={`${process.env.NEXT_PUBLIC_API_URL}${router.asPath}`}
					key='ogUrl'
				></meta>
				<meta property='og:title' content={post.title} key='ogTitle'></meta>
				<meta
					property='og:description'
					content={post.excerpt.replace(/[*_#>]/g, '')}
					key='ogDesc'
				></meta>
				<meta property='og:type' content='article'></meta>
				<meta property='article:published_time' content={post.updatedAt}></meta>
				<meta property='article:tag' content={post.slug.split('-').slice(3).join(' ')}></meta>
				<link
					rel='canonical'
					href={`${process.env.NEXT_PUBLIC_API_URL}${router.asPath}`}
					key='canonical'
				/>
			</Head>
			<BlogPostTemplate content={post.content} date={post.updatedAt} title={post.title} />
		</>
	);
};

export default BlogPost;

export async function getStaticProps({ params: { slug } }) {
	const post = await getPost(slug);
	return {
		props: {
			post,
			notFound: !(post && Object.keys(post).length)
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
