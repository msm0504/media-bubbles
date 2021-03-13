import nc from 'next-connect';
import { getSession } from 'next-auth/client';
import { getSavedResults, saveSearchResult } from '../../../server/services/saved-results-service';

export default nc()
	.get(async function (req, res) {
		const session = await getSession({ req });
		if (!session?.user.id) {
			res.json({ savedResults: [], hasMore: false });
		} else {
			res.json(await getSavedResults(req.query.filter, req.query.page, session.user.id));
		}
	})
	.post(async function (req, res) {
		const session = await getSession({ req });
		const resultToSave = req.body;
		if (session?.user.id) {
			resultToSave.userId = session.user.id;
		}
		res.json(await saveSearchResult(resultToSave));
	});
