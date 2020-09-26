import nc from 'next-connect';
import { getAllSavedResults } from '../../../server/services/saved-results-service';

const ADMIN_ID = '10157984953250379';

export default nc().get(async function (req, res) {
	if (!(req.cookies && req.cookies.userId && req.cookies.userId === ADMIN_ID)) {
		res.json({ savedResults: [], hasMore: false });
	} else {
		res.json(await getAllSavedResults(req.query.filter, req.query.page));
	}
});
