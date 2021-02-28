import AddEditBlogPost from '../../../client/components/blog/add-edit-post';
import APIService from '../../../client/services/api-service';

const EditPost = ({ post }) => <AddEditBlogPost currentVersion={post} />;

export default EditPost;

export async function getServerSideProps({ params: { slug } }) {
	const post = await APIService.callApi('get', `blog-posts/${slug}`);
	return {
		props: {
			post
		}
	};
}
