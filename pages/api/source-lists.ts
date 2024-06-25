import { NextApiRequest, NextApiResponse } from 'next';
import { createRouter } from 'next-connect';
import { getSourceLists } from '@/server/services/source-list-service';

const router = createRouter<NextApiRequest, NextApiResponse>();

router.get(async (req: NextApiRequest, res: NextApiResponse) => {
	res.json(await getSourceLists());
});

export default router.handler();
