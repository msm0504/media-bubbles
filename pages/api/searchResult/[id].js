import nc from 'next-connect';
import { getSession } from 'next-auth/client';
import { deleteSavedResult } from '../../../server/services/saved-results-service';

export default nc().delete(async function (req, res) {
	const session = await getSession({ req });
	res.json(await deleteSavedResult(req.query.id, session?.user.id));
});
