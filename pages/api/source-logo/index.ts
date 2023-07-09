import { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';
import { getSourceLogo } from '@/server/services/source-logo-service';

export default nc().get(async (req: NextApiRequest, res: NextApiResponse) => {
	const image = await getSourceLogo(req.query.id as string, req.query.url as string);
	if (!image) {
		res.status(400).send(`No logo found for ${req.query.id}`);
	} else {
		res.setHeader('content-type', 'image/png');
		res.send(image);
	}
});
