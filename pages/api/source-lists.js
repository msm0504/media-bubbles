import nc from 'next-connect';
import { getSourceLists } from '../../server/util/sources-with-ratings';

export default nc().get(async (req, res) => res.json(await getSourceLists()));
