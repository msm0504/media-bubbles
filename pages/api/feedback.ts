import { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';
import { sendSupportEmail } from '../../server/services/support-email-service';

export default nc().post(async (req: NextApiRequest, res: NextApiResponse) => {
	res.json(await sendSupportEmail(req.body));
});
