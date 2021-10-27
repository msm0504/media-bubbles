import { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';
import { getSession } from 'next-auth/client';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import multer from 'multer';

import { getS3Client } from '../../../server/services/s3Client';
import { getSavedResults, saveSearchResult } from '../../../server/services/saved-results-service';

type MulterRequest = NextApiRequest & {
	file: Express.Multer.File;
};

const upload = multer({ storage: multer.memoryStorage() });
const s3Client = getS3Client();

export default nc()
	.use(upload.single('capture'))
	.get(async (req: NextApiRequest, res: NextApiResponse) => {
		const session = await getSession({ req });
		if (!session?.user.id) {
			res.json({ savedResults: [], pageCount: 0 });
		} else {
			res.json(
				await getSavedResults(req.query.filter.toString(), +req.query.page, session.user.id)
			);
		}
	})
	.post(async (req: MulterRequest, res: NextApiResponse) => {
		const session = await getSession({ req });
		const resultToSave = JSON.parse(req.body.result);
		if (session?.user.id) {
			resultToSave.userId = session.user.id;
		}
		if (req.file && req.file.buffer) {
			const imageKey = `${resultToSave.name.replace(/\s/g, '_')}_${Date.now()}.png`;
			const params = {
				Body: req.file.buffer,
				Key: imageKey,
				Bucket: process.env.AWS_S3_SCREENSHOT_BUCKET,
				ACL: 'public-read'
			};
			const commmand = new PutObjectCommand(params);
			await s3Client.send(commmand);
			resultToSave.imagePath = `http://s3-${process.env.AWS_S3_REGION}.amazonaws.com/${process.env.AWS_S3_SCREENSHOT_BUCKET}/${imageKey}`;
		}
		res.json(await saveSearchResult(resultToSave));
	});

export const config = {
	api: {
		bodyParser: false // Disallow body parsing, consume as stream
	}
};
