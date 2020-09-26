import nc from 'next-connect';
import { appSourceList, sourceListBySlant } from '../../server/util/sources-with-ratings';

export default nc().get((req, res) => res.json({ appSourceList, sourceListBySlant }));
