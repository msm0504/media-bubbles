import { useSession } from 'next-auth/client';
import Head from 'next/head';
import { Button, CardBody, CardTitle, CardText } from 'reactstrap';

import AsyncList from '../../client/components/async-list';
import RouteLink from '../../client/components/nav/route-link';
import markdownToHtml from '../../client/util/markdown-to-html';

const AddPost = (
	<span>
		Add Post <i className='fa fa-lg fa-plus' aria-hidden='true' aria-label='Add Post'></i>
	</span>
);

const EditPost = (
	<i className='fa fa-lg fa-pencil-square-o' aria-hidden='true' aria-label='Edit post'></i>
);

const PostSummary = ({ title, excerpt, slug, updatedAt: date, fnDeleteItem }) => {
	const [session] = useSession();

	return (
		<CardBody>
			<CardTitle>
				<RouteLink buttonText={title} routePath={`/blog/${slug}`} />
			</CardTitle>
			{session?.user.isAdmin && (
				<>
					<Button
						className='float-right p-0 d-block d-sm-inline-block'
						color='link'
						onClick={() => fnDeleteItem(slug, title)}
					>
						<i
							className='fa fa-lg fa-trash-o'
							id={`delete-${slug}-icon`}
							aria-hidden='true'
							aria-label={`Delete post ${slug}`}
						></i>
					</Button>
					<RouteLink
						buttonText={EditPost}
						className='float-right ml-2 d-block d-sm-inline-block'
						routePath={`/blog/edit-post/${slug}`}
					/>
				</>
			)}
			{markdownToHtml(excerpt, 'card-text')}
			<CardText>
				<small className='text-muted'>{`Last updated at ${new Date(date).toLocaleString()}`}</small>
			</CardText>
		</CardBody>
	);
};

const BlogPosts = () => {
	const [session] = useSession();

	return (
		<>
			<Head>
				<link rel='canonical' href={`${process.env.NEXT_PUBLIC_API_URL}/blog`} />
			</Head>
			<h1 className='text-info d-block d-sm-inline-block'>Blog Posts</h1>
			{session?.user.isAdmin && (
				<RouteLink
					buttonText={AddPost}
					className='float-right d-block d-sm-inline-block'
					routePath='/blog/add-post'
				/>
			)}
			<AsyncList
				apiListName='posts'
				apiPath='blog-posts'
				keyField='slug'
				ListItemComponent={PostSummary}
			/>
		</>
	);
};

export default BlogPosts;
