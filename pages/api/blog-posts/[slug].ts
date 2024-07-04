import { NextApiRequest, NextApiResponse } from 'next';
import { createRouter } from 'next-connect';
import { auth } from '@/auth';
import { deletePost } from '@/server/services/blog-service';

const router = createRouter<NextApiRequest, NextApiResponse>();

router.delete(async (req: NextApiRequest, res: NextApiResponse) => {
	const session = await auth(req, res);
	if (!session?.user.isAdmin) {
		res.json({ itemDeleted: false });
	} else {
		res.json(await deletePost(req.query.slug as string));
	}
});

export default router.handler();
