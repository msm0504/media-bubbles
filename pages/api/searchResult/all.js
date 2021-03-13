import nc from 'next-connect';
import { getSession } from 'next-auth/client';
import { getAllSavedResults } from '../../../server/services/saved-results-service';

export default nc().get(async function (req, res) {
	const session = await getSession({ req });
	if (!(session.user && session.user.isAdmin)) {
		res.json({ savedResults: [], hasMore: false });
	} else {
		res.json(await getAllSavedResults(req.query.filter, req.query.page));
	}
});
