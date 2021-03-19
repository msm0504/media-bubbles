import nc from 'next-connect';
import { getSourceLists } from '../../server/services/source-list-service';

export default nc().get(async (req, res) => res.json(await getSourceLists()));
