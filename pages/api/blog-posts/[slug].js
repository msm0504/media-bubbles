import nc from 'next-connect';
import { ADMIN_ID } from '../../../server/constants';
import { getPost, deletePost } from '../../../server/services/blog-service';

export default nc()
	.get(async function (req, res) {
		res.json(await getPost(req.query.slug));
	})
	.delete(async function (req, res) {
		if (!(req.cookies && req.cookies.userId && req.cookies.userId === ADMIN_ID)) {
			res.json({ itemDeleted: false });
		} else {
			res.json(await deletePost(req.query.slug));
		}
	});
