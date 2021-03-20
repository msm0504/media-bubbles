import nc from 'next-connect';
import { getSession } from 'next-auth/client';
import { getSavedResult, deleteSavedResult } from '../../../server/services/saved-results-service';

export default nc()
	.get(async function (req, res) {
		res.json((await getSavedResult(req.query.id)) || {});
	})
	.delete(async function (req, res) {
		const session = await getSession({ req });
		res.json(await deleteSavedResult(req.query.id, session?.user.id));
	});
