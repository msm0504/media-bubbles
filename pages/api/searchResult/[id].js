import nc from 'next-connect';
import { getSavedResult } from '../../../server/services/saved-results-service';

export default nc().get(async function (req, res) {
	res.json(await getSavedResult(req.query.id));
});
