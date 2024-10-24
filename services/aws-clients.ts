import { S3Client } from '@aws-sdk/client-s3';
import { LambdaClient } from '@aws-sdk/client-lambda';

global.s3Client = global.s3Client || null;
global.lambdaClient = global.lambdaClient || null;

export const getS3Client = (): S3Client => {
	if (!global.s3Client) {
		global.s3Client = new S3Client({
			credentials: {
				accessKeyId: process.env.AWS_S3_KEY || '',
				secretAccessKey: process.env.AWS_S3_SECRET || '',
			},
			region: process.env.AWS_REGION,
		});
	}

	return global.s3Client;
};

export const getLambdaClient = (): LambdaClient => {
	if (!global.lambdaClient) {
		global.lambdaClient = new LambdaClient({
			credentials: {
				accessKeyId: process.env.AWS_S3_KEY || '',
				secretAccessKey: process.env.AWS_S3_SECRET || '',
			},
			region: process.env.AWS_REGION,
		});
	}

	return global.lambdaClient;
};
