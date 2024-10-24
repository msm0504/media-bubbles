import { S3Client } from '@aws-sdk/client-s3';

global.s3Client = global.s3Client || null;

export const getS3Client = (): S3Client => {
	if (!global.s3Client) {
		global.s3Client = new S3Client({
			credentials: {
				accessKeyId: process.env.AWS_S3_KEY || '',
				secretAccessKey: process.env.AWS_S3_SECRET || '',
			},
			region: process.env.AWS_S3_REGION,
		});
	}

	return global.s3Client;
};
