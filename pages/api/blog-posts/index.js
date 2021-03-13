import nc from 'next-connect';
import { getSession } from 'next-auth/client';
import { addPost, getPostSummaries } from '../../../server/services/blog-service';

export default nc()
	.get(async function (req, res) {
		res.json(await getPostSummaries(req.query.filter, req.query.page));
	})
	.post(async function (req, res) {
		const session = await getSession({ req });
		if (!(session.user && session.user.isAdmin)) {
			res.json({ slug: null });
		} else {
			res.json(await addPost(req.body));
		}
	});
