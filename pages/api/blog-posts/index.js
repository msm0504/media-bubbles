import nc from 'next-connect';
import { ADMIN_ID } from '../../../server/constants';
import { addPost, getPostSummaries } from '../../../server/services/blog-service';

export default nc()
	.get(async function (req, res) {
		res.json(await getPostSummaries(req.query.filter, req.query.page));
	})
	.post(async function (req, res) {
		if (!(req.cookies && req.cookies.userId && req.cookies.userId === ADMIN_ID)) {
			res.json({ slug: null });
		} else {
			res.json(await addPost(req.body));
		}
	});
