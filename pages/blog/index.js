import { useSelector } from 'react-redux';
import { CardBody, CardTitle, CardText } from 'reactstrap';

import AsyncList from '../../client/components/async-list';
import RouteLink from '../../client/components/nav/route-link';
import markdownToHtml from '../../client/util/markdown-to-html';

const AddPost = (
	<span>
		Add Post <i className='fa fa-plus' aria-hidden='true' aria-label='Add Post'></i>
	</span>
);

const EditPost = (
	<i className='fa fa-2x fa-pencil-square-o' aria-hidden='true' aria-label='Edit post'></i>
);

const PostSummary = ({ title, excerpt, author, slug, date }) => {
	const userId = useSelector(({ loginState }) => loginState.fbUserInfo.userId);

	return (
		<CardBody>
			<CardTitle>
				<RouteLink buttonText={title} routePath={`/blog/${slug}`} />
			</CardTitle>
			{userId === process.env.NEXT_PUBLIC_ADMIN_ID && (
				<RouteLink
					buttonText={EditPost}
					className='float-right ml-2'
					routePath={`/blog/edit-post/${slug}`}
				/>
			)}
			<CardText dangerouslySetInnerHTML={{ __html: markdownToHtml(excerpt) }} />
			<CardText>
				<small className='text-muted'>{`Last updated at ${new Date(
					date
				).toLocaleString()} by ${author}`}</small>
			</CardText>
		</CardBody>
	);
};

const BlogPosts = () => {
	const userId = useSelector(({ loginState }) => loginState.fbUserInfo.userId);

	return (
		<>
			<h1 className='text-info d-block d-sm-inline-block'>Blog Posts</h1>
			{userId === process.env.NEXT_PUBLIC_ADMIN_ID && (
				<RouteLink
					buttonText={AddPost}
					className='float-right d-block d-sm-inline-block'
					routePath='/blog/add-post'
				/>
			)}
			<AsyncList
				apiGetPath='blog-posts'
				apiListName='posts'
				keyField='slug'
				ListItemComponent={PostSummary}
			/>
		</>
	);
};

export default BlogPosts;
