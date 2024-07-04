import { NextApiRequest, NextApiResponse } from 'next';
import { createRouter } from 'next-connect';
import { auth } from '@/auth';
import { deleteSavedResult } from '@/server/services/saved-results-service';

const router = createRouter<NextApiRequest, NextApiResponse>();

router.delete(async (req: NextApiRequest, res: NextApiResponse) => {
	const session = await auth(req, res);
	res.json(await deleteSavedResult(req.query.id as string, session?.user.id));
});

export default router.handler();
