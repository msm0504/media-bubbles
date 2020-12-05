import nc from 'next-connect';
import { getPost } from '../../../server/services/blog-service';

export default nc().get(async function (req, res) {
	res.json(await getPost(req.query.slug));
});
