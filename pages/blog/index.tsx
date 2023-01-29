import { useSession } from 'next-auth/react';
import Head from 'next/head';
import { Button, Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { regular, solid } from '@fortawesome/fontawesome-svg-core/import.macro';

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
		Add Post <FontAwesomeIcon icon={solid('plus')} size='lg' aria-label='Add Post' />
	</span>
);

const EditPost = <FontAwesomeIcon icon={solid('pen-to-square')} size='lg' aria-label='Edit Post' />;

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
						<FontAwesomeIcon
							id={`delete-${slug}-icon`}
							icon={regular('trash-can')}
							size='lg'
							aria-label={`Delete post ${slug}`}
						/>
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
			<h2 className='text-info d-block d-sm-inline-block h1'>Blog Posts</h2>
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
