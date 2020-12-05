import { useRouter } from 'next/router';
import Spinner from '../../client/components/spinner';
import markdownToHtml from '../../client/util/markdown-to-html';
import { getAllPostSlugs, getPost } from '../../server/services/blog-service';

const BlogPost = ({ post }) => {
	const router = useRouter();

	return router.isFallback ? (
		<Spinner />
	) : (
		<>
			<h1 className='text-info'>{post.title}</h1>
			<small className='text-muted'>{`Last updated at ${new Date(post.date).toLocaleString()} by ${
				post.author
			}`}</small>
			<div
				className='mt-2'
				dangerouslySetInnerHTML={{ __html: markdownToHtml(post.content) }}
			></div>
		</>
	);
};

export default BlogPost;

export async function getStaticProps({ params: { slug } }) {
	const post = await getPost(slug);
	const processedContent = markdownToHtml(post.content);
	return {
		props: {
			post: {
				...post,
				content: processedContent
			}
		}
	};
}

export async function getStaticPaths() {
	const slugs = await getAllPostSlugs();

	return {
		paths: slugs.map(slug => ({ params: { slug } })),
		fallback: true
	};
}
