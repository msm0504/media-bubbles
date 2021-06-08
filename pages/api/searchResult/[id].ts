import { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';
import { getSession } from 'next-auth/client';
import { deleteSavedResult } from '../../../server/services/saved-results-service';

export default nc().delete(async (req: NextApiRequest, res: NextApiResponse) => {
	const session = await getSession({ req });
	res.json(await deleteSavedResult(req.query.id as string, session?.user.id));
});
