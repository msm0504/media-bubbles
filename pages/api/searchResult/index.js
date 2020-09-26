import nc from 'next-connect';
import { getSavedResults, saveSearchResult } from '../../../server/services/saved-results-service';

export default nc()
	.get(async function (req, res) {
		if (!(req.cookies && req.cookies.userId)) {
			res.json({ savedResults: [], hasMore: false });
		} else {
			res.json(await getSavedResults(req.query.filter, req.query.page, req.cookies.userId));
		}
	})
	.post(async function (req, res) {
		const resultToSave = req.body;
		if (req.cookies && req.cookies.userId) {
			resultToSave.userId = req.cookies.userId;
		}
		res.json(await saveSearchResult(resultToSave));
	});
