import { useSelector } from 'react-redux';
import RouteLink from '../../client/components/nav/route-link';

const BlogPosts = () => {
	const userId = useSelector(({ loginState }) => loginState.fbUserInfo.userId);

	const AddPost = (
		<span>
			Add Post <i className='fa fa-plus' aria-hidden='true' aria-label='Add Post'></i>
		</span>
	);

	return (
		userId === process.env.NEXT_PUBLIC_ADMIN_ID && (
			<RouteLink buttonText={AddPost} routePath='/blog/add-post' />
		)
	);
};

export default BlogPosts;
