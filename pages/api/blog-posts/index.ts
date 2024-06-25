import { NextApiRequest, NextApiResponse } from 'next';
import { createRouter } from 'next-connect';
import { auth } from '@/auth';
import { getPostSummaries, savePost } from '@/server/services/blog-service';

const router = createRouter<NextApiRequest, NextApiResponse>();

router
	.get(async (req: NextApiRequest, res: NextApiResponse) => {
		res.json(await getPostSummaries(req.query.filter?.toString(), +(req.query.page || 1)));
	})
	.post(async (req: NextApiRequest, res: NextApiResponse) => {
		const session = await auth(req, res);
		if (!session?.user.isAdmin) {
			res.json({ slug: null });
		} else {
			res.json(await savePost(req.body));
		}
	});

export default router.handler();
