import { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';
import { getSession } from 'next-auth/react';
import { deletePost } from '../../../server/services/blog-service';

export default nc().delete(async (req: NextApiRequest, res: NextApiResponse) => {
	const session = await getSession({ req });
	if (!session?.user.isAdmin) {
		res.json({ itemDeleted: false });
	} else {
		res.json(await deletePost(req.query.slug as string));
	}
});
