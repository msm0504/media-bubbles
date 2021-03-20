import nc from 'next-connect';
import { getSession } from 'next-auth/client';
import { getPost, deletePost } from '../../../server/services/blog-service';

export default nc()
	.get(async function (req, res) {
		res.json((await getPost(req.query.slug)) || {});
	})
	.delete(async function (req, res) {
		const session = await getSession({ req });
		if (!session?.user.isAdmin) {
			res.json({ itemDeleted: false });
		} else {
			res.json(await deletePost(req.query.slug));
		}
	});
