import { NextApiRequest, NextApiResponse } from 'next';
import { createRouter } from 'next-connect';
import { sendSupportEmail } from '@/server/services/support-email-service';

const router = createRouter<NextApiRequest, NextApiResponse>();

router.post(async (req: NextApiRequest, res: NextApiResponse) => {
	res.json(await sendSupportEmail(req.body));
});

export default router.handler();
