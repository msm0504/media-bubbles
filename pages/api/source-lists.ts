import { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';
import { getSourceLists } from '../../server/services/source-list-service';

export default nc().get(async (req: NextApiRequest, res: NextApiResponse) => {
	res.json(await getSourceLists());
});
