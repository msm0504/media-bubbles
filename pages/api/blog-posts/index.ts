import { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';
import { getSession } from 'next-auth/client';
import { getPostSummaries, savePost } from '../../../server/services/blog-service';

export default nc()
	.get(async (req: NextApiRequest, res: NextApiResponse) => {
		res.json(await getPostSummaries(req.query.filter?.toString(), +(req.query.page || 1)));
	})
	.post(async (req: NextApiRequest, res: NextApiResponse) => {
		const session = await getSession({ req });
		if (!session?.user.isAdmin) {
			res.json({ slug: null });
		} else {
			res.json(await savePost(req.body));
		}
	});
