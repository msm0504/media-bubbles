import { NextApiRequest, NextApiResponse } from 'next';
import { createRouter } from 'next-connect';
import { getHeadlines } from '@/server/services/bing-news-service';
import type { SearchRequest } from '@/types';

const router = createRouter<NextApiRequest, NextApiResponse>();

router.get(async (req: NextApiRequest, res: NextApiResponse) => {
	res.json(await getHeadlines((req.query as unknown) as SearchRequest));
});

export default router.handler();
