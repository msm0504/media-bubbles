import { useSelector } from 'react-redux';
import { CardBody, CardTitle, CardText } from 'reactstrap';

import AsyncList from '../../client/components/async-list';
import RouteLink from '../../client/components/nav/route-link';
import markdownToHtml from '../../client/util/markdown-to-html';

const PostSummary = ({ title, excerpt, author, slug, date }) => (
	<CardBody>
		<CardTitle>
			<RouteLink buttonText={title} routePath={`/blog/${slug}`} />
		</CardTitle>
		<div className='d-flex'>
			<CardText dangerouslySetInnerHTML={{ __html: markdownToHtml(excerpt) }} />
		</div>
		<CardText>
			<small className='text-muted'>{`Last updated at ${new Date(
				date
			).toLocaleString()} by ${author}`}</small>
		</CardText>
	</CardBody>
);

const BlogPosts = () => {
	const userId = useSelector(({ loginState }) => loginState.fbUserInfo.userId);

	const AddPost = (
		<span>
			Add Post <i className='fa fa-plus' aria-hidden='true' aria-label='Add Post'></i>
		</span>
	);

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
