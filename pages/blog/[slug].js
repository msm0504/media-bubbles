import { useRouter } from 'next/router';
import Spinner from '../../client/components/spinner';
import BlogPostTemplate from '../../client/components/blog/blog-post-template';
import markdownToHtml from '../../client/util/markdown-to-html';
import { getAllPostSlugs, getPost } from '../../server/services/blog-service';

const BlogPost = ({ post }) => {
	const router = useRouter();

	return router.isFallback ? (
		<Spinner />
	) : (
		<BlogPostTemplate content={post.content} date={post.date} title={post.title} />
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
