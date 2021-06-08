import { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';
import { getSession } from 'next-auth/client';
import { getSavedResults, saveSearchResult } from '../../../server/services/saved-results-service';

export default nc()
	.get(async (req: NextApiRequest, res: NextApiResponse) => {
		const session = await getSession({ req });
		if (!session?.user.id) {
			res.json({ savedResults: [], pageCount: 0 });
		} else {
			res.json(
				await getSavedResults(req.query.filter.toString(), +req.query.page, session.user.id)
			);
		}
	})
	.post(async (req: NextApiRequest, res: NextApiResponse) => {
		const session = await getSession({ req });
		const resultToSave = req.body;
		if (session?.user.id) {
			resultToSave.userId = session.user.id;
		}
		res.json(await saveSearchResult(resultToSave));
	});
