import { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';
import { getHeadlines } from '../../server/services/twitter-news-service';
import { SearchRequest } from '../../types';

export default nc().get(async (req: NextApiRequest, res: NextApiResponse) => {
	res.json(await getHeadlines((req.query as unknown) as SearchRequest));
});
