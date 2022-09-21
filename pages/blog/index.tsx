import { useSession } from 'next-auth/react';
import Head from 'next/head';
import { Button, Card } from 'react-bootstrap';

import AsyncList, { DeleteFnType } from '../../client/components/async-list';
import RouteLink from '../../client/components/nav/route-link';
import markdownToHtml from '../../client/util/markdown-to-html';
import { BlogPostSummary } from '../../types';

type PostSummaryProps = {
	item: BlogPostSummary;
	fnDeleteItem: DeleteFnType;
};

const AddPost = (
	<span>
		Add Post <i className='fa-solid fa-lg fa-plus' aria-hidden='true' aria-label='Add Post'></i>
	</span>
);

const EditPost = (
	<i className='fa-solid fa-lg fa-pen-to-square' aria-hidden='true' aria-label='Edit post'></i>
);

const PostSummary: React.FC<PostSummaryProps> = ({
	item: { title, excerpt, slug, updatedAt: date },
	fnDeleteItem
}) => {
	const { data: session } = useSession();

	return (
		<Card.Body>
			<Card.Title>
				<RouteLink buttonText={title} routePath={`/blog/${slug}`} />
			</Card.Title>
			{session?.user.isAdmin && (
				<>
					<Button
						className='float-end p-0 d-block d-sm-inline-block'
						variant='link'
						onClick={() => fnDeleteItem(slug, title)}
					>
						<i
							className='fa-regular fa-lg fa-trash-can'
							id={`delete-${slug}-icon`}
							aria-hidden='true'
							aria-label={`Delete post ${slug}`}
						></i>
					</Button>
					<RouteLink
						buttonText={EditPost}
						className='float-end ms-2 d-block d-sm-inline-block'
						routePath={`/blog/edit-post/${slug}`}
					/>
				</>
			)}
			{markdownToHtml(excerpt, 'card-text')}
			<Card.Text>
				<small className='text-muted'>{`Last updated at ${new Date(date).toLocaleString()}`}</small>
			</Card.Text>
		</Card.Body>
	);
};

const BlogPosts: React.FC = () => {
	const { data: session } = useSession();

	return (
		<>
			<Head>
				<title key='title'>Blog - Media Bubbles</title>
				<link rel='canonical' href={`${process.env.NEXT_PUBLIC_URL}/blog`} key='canonical' />
			</Head>
			<h1 className='text-info d-block d-sm-inline-block'>Blog Posts</h1>
			{session?.user.isAdmin && (
				<RouteLink
					buttonText={AddPost}
					className='float-end d-block d-sm-inline-block'
					routePath='/blog/add-post'
				/>
			)}
			<AsyncList<BlogPostSummary>
				apiListName='posts'
				apiPath='blog-posts'
				keyField='slug'
				ListItemComponent={PostSummary}
			/>
		</>
	);
};

export default BlogPosts;
